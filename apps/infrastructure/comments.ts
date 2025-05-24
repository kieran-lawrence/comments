import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'

import { ConfigType } from './utils/types'
const config = new pulumi.Config('comments')

export class CommentsInfrastructure extends pulumi.ComponentResource {
    clusterEndpoint: pulumi.Output<string>
    apiUrl: pulumi.Output<string>
    cdnUrl: pulumi.Output<string>

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

        // Request existing certificate from ACM
        // Cloudfront requires the certificate to be in the `us-east-1` region
        const certificate = aws.acm.getCertificate(
            {
                domain: '*.codebykieran.com',
                statuses: ['ISSUED'],
                mostRecent: true,
            },
            {
                provider: new aws.Provider(`${name}-cert-region-provider`, {
                    region: 'us-east-1',
                }),
            },
        )
        // Get the ARN of the certificate
        const certificateArn = certificate.then((cert) => cert.arn)

        // Create a domain for the HTTP API
        const commentsDomain = new aws.apigatewayv2.DomainName(
            `${name}-custom-domain`,
            {
                domainName,
                domainNameConfiguration: {
                    certificateArn,
                    endpointType: 'REGIONAL',
                    securityPolicy: 'TLS_1_2',
                },
            },
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
                acmCertificateArn: certificateArn,
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
                allowedMethods: ['GET', 'HEAD'],
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

        // Link the API Gateway to the custom domain
        new aws.apigatewayv2.ApiMapping(`${name}-api-mapping`, {
            apiId: api.id,
            domainName: commentsDomain.domainName,
            stage: '$default',
            apiMappingKey: '',
        })

        this.clusterEndpoint = dbInstance.endpoint
        this.apiUrl = pulumi.interpolate`https://${domainName}/`
        this.cdnUrl = cdn.domainName
    }
}
