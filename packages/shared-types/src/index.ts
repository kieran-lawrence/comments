// ------- Database Schema Types -------
export type CommentStatus =
    | 'PENDING' // New comment, awaiting review
    | 'APPROVED' // Approved by a moderator
    | 'REJECTED' // Reviewed and rejected by a moderator
    | 'FLAGGED' // Community flagged, needs review by a moderator

export type Role = 'USER' | 'MODERATOR' | 'ADMIN'

export type ArticleCommentingStatus = 'OPEN' | 'CLOSED'

export type CommentStatusChangeBy =
    | 'STAFF' // Comment status changed by a staff member (e.g., moderator or admin)
    | 'COMMUNITY' // Comment flagged by community, triggering a review
    | 'SYSTEM' // System-generated change (e.g. auto-approval or rejection)

export type Schema_Site = {
    id: string
    name: string
    createdAt: string
    users: Schema_User[]
    articles: Schema_Article[]
}

export type Schema_User = {
    id: number
    name: string
    role: Role
    email: string
    createdAt: string
    site: Schema_Site
    siteId: string
    articles: Schema_Article[]
    comments: Schema_Comment[]
    commentStatusChanges?: Schema_CommentStatusChange[]
    reviewedComments: Schema_Comment[]
    flaggedComments: Schema_Comment[]
    active: boolean
    deleted: boolean
    suspended: boolean
    suspendedAt?: string
    suspendedUntil?: string
    suspendedBy?: Schema_User
    suspendedById?: number
    suspendedReason?: string
    ignoredUsers: Schema_User[]
}

export type Schema_CommentStatusChange = {
    id: number
    commentId: number
    oldStatus: CommentStatus
    newStatus: CommentStatus
    changedBy: CommentStatusChangeBy
    changedByUser?: Schema_User
    changedById?: number
    changedReason?: string
    changedAt: string
}

export type Schema_Article = {
    id: number
    articleId: string
    articleUrl: string
    articleTitle: string
    status: ArticleCommentingStatus
    createdAt: string
    author: Schema_User
    authorId: number
    comments: Schema_Comment[]
    site: Schema_Site
    siteId: string
}

export type Schema_Comment = {
    id: number
    parentId: number | null
    parent: Schema_Comment | null
    replies: Schema_Comment[]
    content: string
    status: CommentStatus
    likeCount: number
    createdAt: string
    updatedAt: string
    article: Schema_Article
    articleId: number
    author: Schema_User
    authorId: number
    statusChanges?: Schema_CommentStatusChange[]
    reviewedBy: Schema_User | null
    reviewedById: number | null
    flaggedBy: Schema_User | null
    flaggedById: number | null
}

export type Schema_UserIgnoredUsers = {
    userId: number
    ignoredId: number
    ignoredAt: string
    user: Schema_User
    ignored: Schema_User
}

// ------- API Types -------
export type UpdateCommentStatusProps = {
    commentId: number
    status: CommentStatus
    userId: number
    changedBy: CommentStatusChangeBy
}
export type UpdateArticleStatusProps = {
    id: Schema_Article['id']
    articleId: Schema_Article['articleId']
    status: ArticleCommentingStatus
}
export type UpdateArticleProps = Pick<
    Partial<Schema_Article>,
    'articleId' | 'articleUrl' | 'articleTitle' | 'status'
> & { id: Schema_Article['id'] }
