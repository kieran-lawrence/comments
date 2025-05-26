import { Output } from '@pulumi/pulumi'

export type ConfigType = {
    dbName: string
    dbUsername: string
    dbPassword: Output<string>
    domain: string
    subdomain: string
    apiKey: Output<string>
}
