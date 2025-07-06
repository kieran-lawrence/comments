import {
    Schema_Article,
    Schema_Comment,
    Schema_CommentStatusChange,
    StatisticsResponse,
    Schema_User,
    UpdateArticleProps,
    UpdateCommentStatusProps,
    CommentFilterOptions,
    CommentStatus,
} from '@repo/shared-types'

// Calls the API to retrieve all articles
export const getArticles = async (): Promise<Schema_Article[]> => {
    const url = `${import.meta.env.VITE_API_URL}/articles`

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'x-api-key': import.meta.env.VITE_API_KEY,
        },
    })

    if (!response.ok) {
        throw new Error('Unable to retrieve Articles')
    }

    const res: Schema_Article[] = await response.json()
    return res
}

// Calls the API to retrieve all comments, with optional statuses
export const getComments = async (
    status: CommentFilterOptions,
): Promise<Schema_Comment[]> => {
    let url = `${import.meta.env.VITE_API_URL}/comments`

    // Map active status to actual comment statuses or undefined if status is ALL (fetch all comments regardless of status)
    const selectedStatuses: CommentStatus[] | undefined =
        status === 'ALL'
            ? undefined
            : status === 'PENDING REVIEW'
              ? ['PENDING', 'FLAGGED']
              : [status]

    // Build the query parameters based on selected statuses
    if (selectedStatuses && selectedStatuses.length > 0) {
        const params = selectedStatuses
            .map((s) => `status=${encodeURIComponent(s)}`)
            .join('&')
        url += `?${params}`
    }

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'x-api-key': import.meta.env.VITE_API_KEY,
        },
    })

    if (!response.ok) {
        throw new Error('Unable to retrieve Comments')
    }

    const res: Schema_Comment[] = await response.json()
    return res
}

// Calls the API to update the status of a comment
export const updateCommentStatus = async ({
    commentId,
    status,
    userId,
    changedBy,
}: UpdateCommentStatusProps): Promise<Schema_Comment> => {
    const url = `${import.meta.env.VITE_API_URL}/comments/${commentId}/status`
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({
            status,
            changedById: userId,
            changedBy,
        }),
    })

    if (!response.ok) {
        throw new Error('Unable to update Comment Status')
    }

    const res: Schema_Comment = await response.json()
    return res
}

// Calls the API to retrieve all users
export const getUsers = async (): Promise<Schema_User[]> => {
    const url = `${import.meta.env.VITE_API_URL}/users`

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'x-api-key': import.meta.env.VITE_API_KEY,
        },
    })

    if (!response.ok) {
        throw new Error('Unable to retrieve Users')
    }

    const res: Schema_User[] = await response.json()
    return res
}

// Calls the API to retrieve all status changes
export const getStatusChanges = async (): Promise<
    Schema_CommentStatusChange[]
> => {
    const url = `${import.meta.env.VITE_API_URL}/status-changes`

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'x-api-key': import.meta.env.VITE_API_KEY,
        },
    })

    if (!response.ok) {
        throw new Error('Unable to retrieve Status Changes')
    }

    const res: Schema_CommentStatusChange[] = await response.json()
    return res
}
// Calls the API to update an article's details
export const updateArticle = async ({
    id,
    articleId,
    articleUrl,
    articleTitle,
    status,
}: UpdateArticleProps): Promise<Schema_Article> => {
    console.log('Updating article:', {
        articleId,
        status,
    })

    const url = `${import.meta.env.VITE_API_URL}/articles/${id}`
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({
            articleId,
            articleUrl,
            articleTitle,
            status,
        }),
    })
    if (!response.ok) {
        throw new Error('Unable to update Article')
    }
    const res: Schema_Article = await response.json()
    return res
}

export const getStatistics = async (): Promise<StatisticsResponse> => {
    const url = `${import.meta.env.VITE_API_URL}/statistics`

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'x-api-key': import.meta.env.VITE_API_KEY,
        },
    })
    if (!response.ok) {
        throw new Error('Unable to get statistics data')
    }
    const res: StatisticsResponse = await response.json()
    return res
}
