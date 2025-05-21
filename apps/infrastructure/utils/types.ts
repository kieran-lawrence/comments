import { Output } from '@pulumi/pulumi'

export type ConfigType = {
    auroraDbName: string
    auroraDbUsername: string
    auroraDbPassword: Output<string>
    domain: string
    subdomain: string
}
