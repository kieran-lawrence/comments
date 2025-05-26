import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'
import { ConfigType } from '../types'

export interface LambdaArgs {
    lambdaRole: aws.iam.Role
    subnetIds: pulumi.Output<string[]>
    securityGroupId: pulumi.Output<string>
    config: ConfigType
    dbHost: pulumi.Output<string>
    api: aws.apigatewayv2.Api
    routeArgs: {
        requestType: 'GET' | 'POST'
        routeKey: string
    }
}

/** Contructs a Lambdas for the given route and all associated resources */
export class LambdaFunction extends pulumi.ComponentResource {
    constructor(
        stackName: string,
        /** This will be used for the resource name and the handler filename. Ensure the filename matches this. */
        resourceName: string,
        private args: LambdaArgs,
    ) {
        super(
            `${stackName}:LambdaFunction:${resourceName.replace('-', ':')}`,
            `${stackName}-custom-lambda-${resourceName}`,
            {},
        )

        // Destructure the arguments for easier access
        const {
            lambdaRole,
            subnetIds,
            securityGroupId,
            config,
            dbHost,
            api,
            routeArgs,
        } = this.args

        // Create a Lambda function for the specified route
        const lambda = new aws.lambda.Function(
            `${stackName}-${resourceName}-lambda`,
            {
                runtime: aws.lambda.Runtime.NodeJS22dX,
                code: new pulumi.asset.AssetArchive({
                    '.': new pulumi.asset.FileArchive('./dist'),
                }),
                handler: `${resourceName}.handler`,
                role: lambdaRole.arn,
                vpcConfig: {
                    subnetIds,
                    securityGroupIds: [securityGroupId],
                },
                environment: {
                    variables: {
                        DB_HOST: dbHost,
                        DB_USER: config.dbUsername,
                        DB_PASSWORD: config.dbPassword,
                        DB_NAME: config.dbName,
                    },
                },
            },
        )

        // Define the integration for the API Gateway to link it to the Lambda function
        const integration = new aws.apigatewayv2.Integration(
            `${stackName}-lambda-integration-${resourceName}`,
            {
                apiId: api.id,
                integrationType: 'AWS_PROXY',
                integrationUri: lambda.arn,
                integrationMethod: routeArgs.requestType,
                payloadFormatVersion: '2.0',
            },
        )

        // Define the route for the API Gateway
        new aws.apigatewayv2.Route(`${stackName}-${resourceName}-route`, {
            apiId: api.id,
            routeKey: `${routeArgs.requestType} ${routeArgs.routeKey}`, // i.e. POST /comments
            target: pulumi.interpolate`integrations/${integration.id}`,
        })

        // Allow the lambda to be invoked by API Gateway
        new aws.lambda.Permission(
            `${stackName}-apigateway-${resourceName}-lambda-permission`,
            {
                action: 'lambda:InvokeFunction',
                function: lambda.name,
                principal: 'apigateway.amazonaws.com',
                sourceArn: pulumi.interpolate`${api.executionArn}/*/*`,
            },
        )
    }
}
