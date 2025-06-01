import { CommentsInfrastructure } from './comments'

const comments = new CommentsInfrastructure('comments')

export const clusterEndpoint = comments.clusterEndpoint
export const apiUrl = comments.apiUrl
export const cdnUrl = comments.cdnUrl
export const validationName = comments.validationName
export const validationType = comments.validationType
export const validationValue = comments.validationValue
export const route53NameServers = comments.route53NameServers
export const ecsPublicIp = comments.ecsPublicIp
export const ecrRepositoryUrl = comments.ecrRepositoryUrl
