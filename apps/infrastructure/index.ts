import { CommentsInfrastructure } from './comments'

const comments = new CommentsInfrastructure('comments')

export const clusterEndpoint = comments.clusterEndpoint
