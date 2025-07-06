import {
    ArticlesTable,
    ErrorComponent,
    Filter,
    LoadingOverlay,
    PageLayout,
    Search,
} from '@repo/ui'
import { createFileRoute } from '@tanstack/react-router'
import {
    getArticles,
    updateArticle,
    updateCommentStatus,
} from '../services/api'
import { useQuery } from '@tanstack/react-query'
import {
    ArticleCommentingStatus,
    SortOptions,
    UpdateArticleStatusProps,
    UpdateCommentStatusProps,
} from '@repo/shared-types'
import { useMemo, useState } from 'react'
import {
    filterArticlesByStatus,
    searchArticles,
    sortArticles,
} from '../utils/helpers'
import { useAuth0 } from '@auth0/auth0-react'

export const Route = createFileRoute('/_auth/articles')({
    component: ArticlesPage,
    errorComponent: ({ error }) => (
        <ErrorComponent
            message={error.message}
            details={error.cause as string}
        />
    ),
})

function ArticlesPage() {
    const {
        data: articles,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ['getArticlesKey'],
        queryFn: getArticles,
    })
    const { user, isLoading: authLoading } = useAuth0()
    const [statusFilter, setStatusFilter] =
        useState<ArticleCommentingStatus>('OPEN')
    const [sort, setSort] = useState<SortOptions>('Newest First')
    const [searchTerm, setSearchTerm] = useState('')

    const searchFilteredArticles = useMemo(() => {
        if (!articles) return null
        const filtered = filterArticlesByStatus(
            sortArticles(articles, sort),
            statusFilter,
        )
        if (!searchTerm) return filtered
        return searchArticles(filtered, searchTerm)
    }, [articles, searchTerm, statusFilter, sort])

    if (isLoading || authLoading) {
        return <LoadingOverlay />
    }
    if (isError || !searchFilteredArticles) {
        throw new Error(
            `Encountered an issue while fetching article data.\n Please try again later or contact us if the problem persists.`,
            {
                cause: 'Error with query: getArticles on /articles route',
            },
        )
    }

    if (!user || !user.sub) {
        throw new Error(
            `Encountered an issue while fetching user information.\n Please try again later or contact us if the problem persists.`,
            {
                cause: 'No user returned from Auth0 on /articles route',
            },
        )
    }

    const handleCommentReview = async (props: UpdateCommentStatusProps) => {
        await updateCommentStatus(props)
        // Refetch comments to update the UI after a status change
        refetch()
    }
    const handleStatusChange = async (props: UpdateArticleStatusProps) => {
        await updateArticle({ ...props })
        refetch()
    }

    return (
        <PageLayout
            sidebar={
                <div className="flex flex-col items-left gap-6">
                    <Search
                        placeholder="Search by article title or author"
                        onSearch={setSearchTerm}
                    />
                    <Filter<ArticleCommentingStatus>
                        filterTitle="Commenting Status"
                        filterOptions={['OPEN', 'CLOSED']}
                        activeItem={statusFilter}
                        onClick={setStatusFilter}
                    />
                    <Filter<SortOptions>
                        filterTitle="Sort"
                        filterOptions={['Newest First', 'Oldest First']}
                        activeItem={sort}
                        onClick={setSort}
                    />
                </div>
            }
            mainContent={
                <div className="flex flex-col gap-4">
                    <ArticlesTable
                        articles={searchFilteredArticles}
                        onCommentReview={handleCommentReview}
                        onStatusChange={handleStatusChange}
                        userId={user.sub!}
                    />
                </div>
            }
        />
    )
}
