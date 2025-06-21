import {
    Schema_Article,
    Schema_Comment,
    Schema_CommentStatusChange,
    Schema_User,
    UpdateArticleProps,
    UpdateCommentStatusProps,
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

// Calls the API to retrieve all comments
export const getComments = async (): Promise<Schema_Comment[]> => {
    const url = `${import.meta.env.VITE_API_URL}/comments`

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
