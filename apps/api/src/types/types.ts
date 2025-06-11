import * as z from 'zod'

/** --- Enums --- */
export const commentStatusChangeBySchema = z.enum([
    'STAFF', // Comment status changed by a staff member (e.g., moderator or admin)
    'COMMUNITY', // Comment flagged by community, triggering a review
    'SYSTEM', // System-generated change (e.g. auto-approval or rejection)
])
export const commentStatusSchema = z.enum([
    'PENDING', // New comment, awaiting review
    'APPROVED', // Approved by a moderator
    'REJECTED', // Reviewed and rejected by a moderator
    'FLAGGED', // Community flagged, needs review by a moderator
])
export const articleCommentingStatusSchema = z.enum(['OPEN', 'CLOSED'])
export const roleSchema = z.enum(['USER', 'MODERATOR', 'ADMIN'])

export type CommentStatusChangeBy = z.infer<typeof commentStatusChangeBySchema>
export type CommentStatus = z.infer<typeof commentStatusSchema>
export type ArticleCommentingStatus = z.infer<
    typeof articleCommentingStatusSchema
>
export type Role = z.infer<typeof roleSchema>
