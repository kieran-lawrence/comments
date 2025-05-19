import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'

import { ConfigType } from './utils/types'
const config = new pulumi.Config('comments')

export class CommentsInfrastructure extends pulumi.ComponentResource {
    clusterEndpoint: pulumi.Output<string>

    constructor(name: string, opts?: pulumi.ComponentResourceOptions) {
        super('CommentsInfrastructure', name, {}, opts)

        const configObject: ConfigType = {
            auroraDbName: config.require('db-name'),
            auroraDbUsername: config.require('db-username'),
            auroraDbPassword: config.requireSecret('db-password'),
        }

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

        this.clusterEndpoint = cluster.endpoint
    }
}
