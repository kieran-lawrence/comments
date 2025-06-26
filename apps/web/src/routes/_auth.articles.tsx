import {
    ArticlesTable,
    ErrorComponent,
    LoadingOverlay,
    PageLayout,
} from '@repo/ui'
import { createFileRoute } from '@tanstack/react-router'
import {
    getArticles,
    updateArticle,
    updateCommentStatus,
} from '../services/api'
import { useQuery } from '@tanstack/react-query'
import {
    UpdateArticleStatusProps,
    UpdateCommentStatusProps,
} from '@repo/shared-types'

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

    if (isLoading) {
        return <LoadingOverlay />
    }
    if (isError || !articles) {
        throw new Error(
            `Encountered an issue while fetching article data.\n Please try again later or contact us if the problem persists.`,
            {
                cause: 'Error with query: getArticles on /articles route',
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
            sidebar={<>Sidebar</>}
            mainContent={
                <div className="flex flex-col gap-4">
                    <ArticlesTable
                        articles={articles}
                        onCommentReview={handleCommentReview}
                        onStatusChange={handleStatusChange}
                    />
                </div>
            }
        />
    )
}
