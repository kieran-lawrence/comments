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
            auroraDbName: config.require('db-name'),
            auroraDbUsername: config.require('db-username'),
            auroraDbPassword: config.requireSecret('db-password'),
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

        // Create subnets for the Aurora cluster
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

        // Create a subnet group for the Aurora cluster
        const subnetGroup = new aws.rds.SubnetGroup(`${name}-subnet-group`, {
            subnetIds: [subnetA.id, subnetB.id],
        })

        // Security Group for Aurora
        const securityGroup = new aws.ec2.SecurityGroup(`${name}-aurora-sg`, {
            vpcId: vpc.id,
            ingress: [
                {
                    protocol: 'tcp',
                    fromPort: 3306,
                    toPort: 3306,
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

        // Define & configure the Aurora cluster
        const cluster = new aws.rds.Cluster(`${name}-aurora-cluster`, {
            engine: 'aurora-postgresql',
            engineMode: 'provisioned',
            databaseName: configObject.auroraDbName,
            masterUsername: configObject.auroraDbUsername,
            masterPassword: configObject.auroraDbPassword,
            dbSubnetGroupName: subnetGroup.name,
            vpcSecurityGroupIds: [securityGroup.id],
            skipFinalSnapshot: true,
            serverlessv2ScalingConfiguration: {
                minCapacity: 2,
                maxCapacity: 2,
            },
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
                    domainName: commentsDomain.domainNameConfiguration.apply(
                        (cfg) => cfg.targetDomainName,
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

        this.clusterEndpoint = cluster.endpoint
        this.apiUrl = pulumi.interpolate`https://${domainName}/`
        this.cdnUrl = cdn.domainName
    }
}
