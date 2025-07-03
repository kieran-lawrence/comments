import {
    ArticleCommentingStatus,
    CommentFilterOptions,
    SortOptions,
    Schema_Article,
    Schema_Comment,
    Schema_User,
    AccountStatusOptions,
    RoleFilterOptions,
    Schema_CommentStatusChange,
    CommentStatusOptions,
} from '@repo/shared-types'

type FilteredCommentWithCount = {
    comments: Schema_Comment[]
    count: number
}
type CommentFilterResult = Record<
    CommentFilterOptions,
    FilteredCommentWithCount
>
export const getFilteredCommentsWithCounts = (
    comments: Schema_Comment[],
): CommentFilterResult => {
    const pending = comments.filter(
        (comment) =>
            comment.status === 'PENDING' || comment.status === 'FLAGGED',
    )
    const approved = comments.filter((comment) => comment.status === 'APPROVED')
    const rejected = comments.filter((comment) => comment.status === 'REJECTED')
    return {
        All: { comments, count: comments.length },
        'Pending Review': { comments: pending, count: pending.length },
        Approved: { comments: approved, count: approved.length },
        Rejected: { comments: rejected, count: rejected.length },
    }
}

const sortByDate = <T extends { createdAt: string }>(
    items: T[],
    sortFilter: SortOptions,
): T[] => {
    return items.sort((a, b) => {
        if (sortFilter === 'Newest First') {
            return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
        } else {
            return (
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            )
        }
    })
}

export const sortComments = (
    comments: Schema_Comment[],
    sortFilter: SortOptions,
) => {
    return sortByDate(comments, sortFilter)
}

export const searchComments = (
    comments: Schema_Comment[],
    searchTerm: string,
): Schema_Comment[] => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    return comments.filter(
        (comment) =>
            comment.article.articleTitle
                .toLowerCase()
                .includes(lowerCaseSearchTerm) ||
            comment.author.name.toLowerCase().includes(lowerCaseSearchTerm),
    )
}

export const filterArticlesByStatus = (
    articles: Schema_Article[],
    status: ArticleCommentingStatus,
): Schema_Article[] => {
    return articles.filter((article) => article.status === status)
}

export const sortArticles = (
    articles: Schema_Article[],
    sortFilter: SortOptions,
) => {
    return sortByDate(articles, sortFilter)
}

export const searchArticles = (
    articles: Schema_Article[],
    searchTerm: string,
): Schema_Article[] => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    return articles.filter(
        (article) =>
            article.articleTitle.toLowerCase().includes(lowerCaseSearchTerm) ||
            article.author.name.toLowerCase().includes(lowerCaseSearchTerm),
    )
}

export const filterUsersByRole = (
    users: Schema_User[],
    role: RoleFilterOptions,
): Schema_User[] => {
    return role === 'ALL' ? users : users.filter((user) => user.role === role)
}

export const filterUsersByStatus = (
    users: Schema_User[],
    status: AccountStatusOptions,
): Schema_User[] => {
    return users.filter((user) => {
        if (status === 'Active') return user.active
        if (status === 'Deleted') return user.deleted
        if (status === 'Banned') return user.suspended
        if (status === 'Suspended') return user.suspended && user.suspendedUntil
        return false
    })
}

export const searchUsers = (
    users: Schema_User[],
    searchTerm: string,
): Schema_User[] => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    return users.filter(
        (user) =>
            user.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            user.email.toLowerCase().includes(lowerCaseSearchTerm),
    )
}

export const sortUsers = (
    users: Schema_User[],
    sortFilter: SortOptions,
): Schema_User[] => {
    return sortByDate(users, sortFilter)
}

export const filterCommentStatusChangesByStatus = (
    changes: Schema_CommentStatusChange[],
    status: CommentStatusOptions,
): Schema_CommentStatusChange[] => {
    return status === 'ALL'
        ? changes
        : changes.filter((change) => {
              return change.newStatus === status
          })
}

export const filterCommentStatusChangesByChangedBy = (
    changes: Schema_CommentStatusChange[],
    changedBy: string,
): Schema_CommentStatusChange[] => {
    return changedBy === 'ALL'
        ? changes
        : changes.filter((change) => change.changedBy === changedBy)
}

export const sortCommentStatusChanges = (
    changes: Schema_CommentStatusChange[],
    sortFilter: SortOptions,
): Schema_CommentStatusChange[] => {
    return changes.sort((a, b) => {
        if (sortFilter === 'Newest First') {
            return (
                new Date(b.changedAt).getTime() -
                new Date(a.changedAt).getTime()
            )
        } else {
            return (
                new Date(a.changedAt).getTime() -
                new Date(b.changedAt).getTime()
            )
        }
    })
}

export const searchCommentStatusChanges = (
    changes: Schema_CommentStatusChange[],
    searchTerm: string,
): Schema_CommentStatusChange[] => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    return changes.filter(
        (change) =>
            change.changedByUser?.name
                .toLowerCase()
                .includes(lowerCaseSearchTerm) ||
            change.comment.article.articleTitle
                .toLowerCase()
                .includes(lowerCaseSearchTerm),
    )
}
