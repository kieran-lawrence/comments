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

export type Schema_User = {
    id: string
    name: string
    role: Role
    email: string
    createdAt: string
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
    comment: Schema_Comment
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
    flaggedCount: number
    likes?: Schema_CommentLike[]
    flags?: Schema_CommentFlag[]
}

export type Schema_UserIgnoredUsers = {
    userId: number
    ignoredId: number
    ignoredAt: string
    user: Schema_User
    ignored: Schema_User
}

export type Schema_CommentLike = {
    id: number
    userId: string
    commentId: number
    createdAt: string
    comment?: Schema_Comment
    user?: Schema_User
}

export type Schema_CommentFlag = {
    id: number
    userId: string
    commentId: number
    createdAt: string
    comment?: Schema_Comment
    user?: Schema_User
}

// ------- API Parameter Types -------
// Types representing the parameters passed to API endpoints.
export type UpdateCommentStatusProps = {
    commentId: number
    status: CommentStatus
    userId: string
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

// ------- API Response Types -------
// Types representing the structure of data returned by API endpoints.
export type EngagementSummaryResponse = {
    newCommentsToday: number
    pendingComments: number
    totalComments: Pick<Schema_Comment, 'id' | 'status'>[]
    activeUsers: number
}
export type NewUserResponse = { date: string; userCount: number }
export type RecentCommentsResponse = { hour: string; commentCount: number }
export type TopCommentResponse = Pick<
    Schema_Article,
    'articleId' | 'articleTitle' | 'articleUrl'
> & {
    commentCount: number
}

export type StatisticsResponse = EngagementSummaryResponse & {
    newUsersLast7Days: NewUserResponse[]
    commentsLast24Hours: RecentCommentsResponse[]
    topCommentsToday: TopCommentResponse[]
}

// ------- Filter/Sort Key Types -------
export type CommentFilterOptions =
    | 'ALL'
    | 'PENDING REVIEW'
    | 'APPROVED'
    | 'REJECTED'
export type SortOptions = 'Newest First' | 'Oldest First'
export type RoleFilterOptions = Role | 'ALL'
export type CommentStatusOptions = CommentStatus | 'ALL'
export type CommentStatusChangeByOptions = CommentStatusChangeBy | 'ALL'
export type AccountStatusOptions = 'Active' | 'Suspended' | 'Banned' | 'Deleted'

// This union type combines all filter options into a single type for use in the filter component so it accepts any of the defined filter options.
export type FilterOption =
    | CommentFilterOptions
    | SortOptions
    | ArticleCommentingStatus
    | RoleFilterOptions
    | AccountStatusOptions
    | CommentStatusOptions
    | CommentStatusChangeByOptions
