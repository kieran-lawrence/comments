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
    ecsPublicIp: pulumi.Output<string>
    ecrRepositoryUrl: pulumi.Output<string>

    constructor(name: string, opts?: pulumi.ComponentResourceOptions) {
        super('CommentsInfrastructure', name, {}, opts)

        const configObject: ConfigType = {
            dbName: config.require('db-name'),
            dbUsername: config.require('db-username'),
            dbPassword: config.requireSecret('db-password'),
            domain: config.require('domain'),
            subdomain: config.require('subdomain'),
            apiKey: config.requireSecret('api-key'),
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

        // Create an Internet Gateway to allow internet access for the VPC
        const igw = new aws.ec2.InternetGateway(`${name}-igw`, {
            vpcId: vpc.id,
        })

        // Create a route table with a route to the Internet Gateway to allow public access
        const publicRouteTable = new aws.ec2.RouteTable(`${name}-public-rt`, {
            vpcId: vpc.id,
            routes: [
                {
                    cidrBlock: '0.0.0.0/0',
                    gatewayId: igw.id,
                },
            ],
        })

        // Associate the route table with each subnet
        new aws.ec2.RouteTableAssociation(`${name}-subnet-a-assoc`, {
            subnetId: subnetA.id,
            routeTableId: publicRouteTable.id,
        })
        new aws.ec2.RouteTableAssociation(`${name}-subnet-b-assoc`, {
            subnetId: subnetB.id,
            routeTableId: publicRouteTable.id,
        })

        // Security Groups for RDS and ECS
        const ecsSecurityGroup = new aws.ec2.SecurityGroup(`${name}-ecs-sg`, {
            vpcId: vpc.id,
            ingress: [
                {
                    protocol: 'tcp',
                    fromPort: 80,
                    toPort: 80,
                    cidrBlocks: ['0.0.0.0/0'],
                },
                // { // Uncomment to allow SSH access to the ECS instance
                //     protocol: 'tcp',
                //     fromPort: 22,
                //     toPort: 22,
                //     cidrBlocks: ['0.0.0.0/0'],
                // },
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
        const dbSecurityGroup = new aws.ec2.SecurityGroup(`${name}-db-sg`, {
            vpcId: vpc.id,
            ingress: [
                {
                    protocol: 'tcp',
                    fromPort: 5432,
                    toPort: 5432,
                    securityGroups: [ecsSecurityGroup.id], // Allow ECS security group to access RDS
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
            vpcSecurityGroupIds: [dbSecurityGroup.id],
            skipFinalSnapshot: true,
            storageEncrypted: false,
            multiAz: false,
            autoMinorVersionUpgrade: true,
        })

        // ECS Cluster
        const ecsCluster = new aws.ecs.Cluster(`${name}-ecs-cluster`)

        // IAM Role for ECS Instance
        const ecsInstanceRole = new aws.iam.Role(`${name}-ecs-instance-role`, {
            assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
                Service: 'ec2.amazonaws.com',
            }),
        })
        new aws.iam.RolePolicyAttachment(`${name}-ecs-instance-policy`, {
            role: ecsInstanceRole.name,
            policyArn:
                'arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role',
        })

        // Instance Profile
        const ecsInstanceProfile = new aws.iam.InstanceProfile(
            `${name}-ecs-instance-profile`,
            {
                role: ecsInstanceRole.name,
            },
        )

        // ECS Instance
        const ecsInstance = new aws.ec2.Instance(`${name}-ecs-instance`, {
            // Fetches the latest Amazon ECS-optimized AMI
            ami: aws.ec2
                .getAmi({
                    filters: [
                        {
                            name: 'name',
                            values: ['amzn2-ami-ecs-hvm-*-x86_64-ebs'],
                        },
                        { name: 'owner-alias', values: ['amazon'] },
                    ],
                    mostRecent: true,
                })
                .then((ami) => ami.id),
            instanceType: 't3.micro',
            subnetId: subnetA.id,
            vpcSecurityGroupIds: [ecsSecurityGroup.id],
            iamInstanceProfile: ecsInstanceProfile.name,
            keyName: 'my-key-pair',
            userData: ecsCluster.name.apply(
                (clusterName) =>
                    `#!/bin/bash\necho ECS_CLUSTER=${clusterName} >> /etc/ecs/ecs.config`, // Runs on instance startup, configures the ECS agent to join ECS cluster
            ),
            tags: { Name: `${name}-ecs-instance` },
        })

        // ECS Task Execution Role
        const ecsTaskExecutionRole = new aws.iam.Role(
            `${name}-ecs-task-exec-role`,
            {
                assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
                    Service: 'ecs-tasks.amazonaws.com',
                }),
            },
        )
        new aws.iam.RolePolicyAttachment(`${name}-ecs-task-exec-policy`, {
            role: ecsTaskExecutionRole.name,
            policyArn:
                'arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy',
        })

        // ECR Repository
        const ecrRepo = new aws.ecr.Repository(`${name}-ecr-repo`)

        // Get the Container image URI
        const imageUri = pulumi.interpolate`${ecrRepo.repositoryUrl}:latest`

        // ECS Task Definition
        const taskDefinition = new aws.ecs.TaskDefinition(`${name}-task-def`, {
            family: `${name}-family`,
            cpu: '256',
            memory: '256',
            networkMode: 'bridge',
            requiresCompatibilities: ['EC2'],
            executionRoleArn: ecsTaskExecutionRole.arn,
            containerDefinitions: pulumi
                .output([
                    {
                        name: 'app',
                        image: imageUri,
                        essential: true,
                        portMappings: [{ containerPort: 80, hostPort: 80 }],
                        environment: [
                            {
                                name: 'DATABASE_URL',
                                value: pulumi.interpolate`postgres://${configObject.dbUsername}:${configObject.dbPassword}@${dbInstance.endpoint}/${configObject.dbName}?schema=public`,
                            },
                            { name: 'API_KEY', value: configObject.apiKey },
                        ],
                    },
                ])
                .apply(JSON.stringify),
        })

        // ALB
        const alb = new aws.lb.LoadBalancer(`${name}-alb`, {
            internal: false,
            loadBalancerType: 'application',
            securityGroups: [ecsSecurityGroup.id],
            subnets: [subnetA.id, subnetB.id],
        })

        // Target Group
        const targetGroup = new aws.lb.TargetGroup(`${name}-tg`, {
            port: 80,
            protocol: 'HTTP',
            vpcId: vpc.id,
            targetType: 'instance',
            healthCheck: { path: '/' },
        })

        // Listener
        const listener = new aws.lb.Listener(`${name}-listener`, {
            loadBalancerArn: alb.arn,
            port: 80,
            protocol: 'HTTP',
            defaultActions: [
                { type: 'forward', targetGroupArn: targetGroup.arn },
            ],
        })

        // ECS Service with ALB
        new aws.ecs.Service(
            `${name}-ecs-service`,
            {
                cluster: ecsCluster.arn,
                taskDefinition: taskDefinition.arn,
                desiredCount: 1,
                launchType: 'EC2',
                loadBalancers: [
                    {
                        targetGroupArn: targetGroup.arn,
                        containerName: 'app',
                        containerPort: 80,
                    },
                ],
            },
            { dependsOn: [listener] },
        )

        // Create a Route53 zone for the domain
        const zone = new aws.route53.Zone(`${name}-zone`, {
            name: domainName,
        })

        // ACM Certificate in us-east-1 for CloudFront
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
                    domainName: alb.dnsName,
                    originId: apiOriginName,
                    customOriginConfig: {
                        originProtocolPolicy: 'http-only',
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
                        'x-api-key',
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

        // Outputs
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
        this.ecsPublicIp = ecsInstance.publicIp
        this.ecrRepositoryUrl = ecrRepo.repositoryUrl
    }
}
