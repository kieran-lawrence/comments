import { CommentsInfrastructure } from './comments'

const comments = new CommentsInfrastructure('comments')

export const clusterEndpoint = comments.clusterEndpoint
export const apiUrl = comments.apiUrl
export const cdnUrl = comments.cdnUrl
