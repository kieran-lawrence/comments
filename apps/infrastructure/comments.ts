import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'
import { ConfigType } from './utils/types'
const config = new pulumi.Config('comments')

export class CommentsInfrastructure extends pulumi.ComponentResource {
    clusterEndpoint: pulumi.Output<string>
    apiUrl: pulumi.Output<string>
    cdnUrl: pulumi.Output<string>
    validationName: pulumi.Output<string>
    validationType: pulumi.Output<string>
    validationValue: pulumi.Output<string>
    route53NameServers: pulumi.Output<string[]>

    constructor(name: string, opts?: pulumi.ComponentResourceOptions) {
        super('CommentsInfrastructure', name, {}, opts)

        const configObject: ConfigType = {
            dbName: config.require('db-name'),
            dbUsername: config.require('db-username'),
            dbPassword: config.requireSecret('db-password'),
            domain: config.require('domain'),
            subdomain: config.require('subdomain'),
        }
        const domainName = pulumi.interpolate`${configObject.subdomain}.${configObject.domain}`

        // Create a new VPC
        const vpc = new aws.ec2.Vpc(`${name}-vpc`, {
            cidrBlock: '10.0.0.0/16',
            enableDnsHostnames: true,
            enableDnsSupport: true,
        })

        // Create subnets for the RDS cluster
        const subnetA = new aws.ec2.Subnet(`${name}-subnet-a`, {
            vpcId: vpc.id,
            cidrBlock: '10.0.1.0/24',
            availabilityZone: 'ap-southeast-2a',
        })
        const subnetB = new aws.ec2.Subnet(`${name}-subnet-b`, {
            vpcId: vpc.id,
            cidrBlock: '10.0.2.0/24',
            availabilityZone: 'ap-southeast-2b',
        })

        // Create a subnet group for the RDS cluster
        const subnetGroup = new aws.rds.SubnetGroup(`${name}-subnet-group`, {
            subnetIds: [subnetA.id, subnetB.id],
        })

        // Security Group for RDS
        const securityGroup = new aws.ec2.SecurityGroup(`${name}-db-sg`, {
            vpcId: vpc.id,
            ingress: [
                {
                    protocol: 'tcp',
                    fromPort: 5432,
                    toPort: 5432,
                    cidrBlocks: ['0.0.0.0/0'],
                },
            ],
            egress: [
                {
                    protocol: '-1',
                    fromPort: 0,
                    toPort: 0,
                    cidrBlocks: ['0.0.0.0/0'],
                },
            ],
        })

        // Add RDS PostgreSQL instance
        const dbInstance = new aws.rds.Instance(`${name}-postgres-instance`, {
            allocatedStorage: 20,
            engine: 'postgres',
            engineVersion: '17.5',
            instanceClass: 'db.t3.micro',
            dbName: configObject.dbName,
            username: configObject.dbUsername,
            password: configObject.dbPassword,
            dbSubnetGroupName: subnetGroup.name,
            vpcSecurityGroupIds: [securityGroup.id],
            skipFinalSnapshot: true,
            storageEncrypted: false,
            multiAz: false,
            autoMinorVersionUpgrade: true,
        })

        // Create the API Gateway
        const api = new aws.apigatewayv2.Api(`${name}-apigateway`, {
            protocolType: 'HTTP',
        })

        // Create default stage
        new aws.apigatewayv2.Stage(`${name}-stage`, {
            apiId: api.id,
            name: '$default',
            autoDeploy: true,
        })

        // Create a Route53 zone for the domain
        const zone = new aws.route53.Zone(`${name}-zone`, {
            name: domainName,
        })

        const eastRegionProvider = new aws.Provider(
            `${name}-cert-region-provider`,
            {
                region: 'us-east-1',
            },
        )

        // Create a certificate for the domain
        const certificate = new aws.acm.Certificate(
            `${name}-certificate`,
            {
                domainName,
                validationMethod: 'DNS',
            },
            {
                provider: eastRegionProvider,
            },
        )

        // Create a Route53 record for certificate validation
        const routeRecord = new aws.route53.Record(
            `${name}-route-53-record`,
            {
                zoneId: zone.zoneId,
                name: certificate.domainValidationOptions[0].resourceRecordName,
                type: certificate.domainValidationOptions[0].resourceRecordType,
                records: [
                    certificate.domainValidationOptions[0].resourceRecordValue,
                ],
                ttl: 300,
            },
            { provider: eastRegionProvider },
        )

        // Validate the certificate using the Route53 record
        const certValidation = new aws.acm.CertificateValidation(
            `${name}-certificate-validation`,
            {
                certificateArn: certificate.arn,
                validationRecordFqdns: [routeRecord.fqdn],
            },
            { provider: eastRegionProvider },
        )

        // Set up CDN
        const apiOriginName = `${name}-api-origin`
        const cdn = new aws.cloudfront.Distribution(`${name}-distribution`, {
            enabled: true,
            aliases: [domainName],
            priceClass: 'PriceClass_100',
            restrictions: {
                geoRestriction: {
                    restrictionType: 'none',
                },
            },
            viewerCertificate: {
                acmCertificateArn: certValidation.certificateArn,
                sslSupportMethod: 'sni-only',
                minimumProtocolVersion: 'TLSv1.2_2021',
            },
            origins: [
                {
                    domainName: api.apiEndpoint.apply((endpoint) =>
                        endpoint.replace('https://', ''),
                    ),
                    originId: apiOriginName,
                    customOriginConfig: {
                        originProtocolPolicy: 'https-only',
                        httpPort: 80,
                        httpsPort: 443,
                        originSslProtocols: ['TLSv1.2'],
                    },
                },
            ],
            defaultCacheBehavior: {
                allowedMethods: [
                    'HEAD',
                    'DELETE',
                    'POST',
                    'GET',
                    'OPTIONS',
                    'PUT',
                    'PATCH',
                ],
                cachedMethods: ['GET', 'HEAD'],
                targetOriginId: apiOriginName,
                viewerProtocolPolicy: 'redirect-to-https',
                forwardedValues: {
                    queryString: false,
                    cookies: { forward: 'none' },
                    headers: [
                        'Accept',
                        'Accept-Encoding',
                        'Access-Control-Allow-Origin',
                        'Authorization',
                        'Caller',
                        'Content-Type',
                        'Origin',
                    ],
                },
                compress: true,
            },
        })

        // Create a Ipv4 Route53 record for the custom domain
        new aws.route53.Record(`${name}-api-record-A`, {
            name: domainName,
            zoneId: zone.zoneId,
            type: 'A',
            aliases: [
                {
                    name: cdn.domainName,
                    zoneId: cdn.hostedZoneId,
                    evaluateTargetHealth: false,
                },
            ],
        })

        this.clusterEndpoint = dbInstance.endpoint
        this.apiUrl = pulumi.interpolate`https://${domainName}/`
        this.cdnUrl = cdn.domainName
        this.validationName =
            certificate.domainValidationOptions[0].resourceRecordName
        this.validationType =
            certificate.domainValidationOptions[0].resourceRecordType
        this.validationValue =
            certificate.domainValidationOptions[0].resourceRecordValue
        this.route53NameServers = zone.nameServers
    }
}
