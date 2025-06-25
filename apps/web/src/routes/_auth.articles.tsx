import { ArticlesTable, PageLayout } from '@repo/ui'
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

    // TODO: Add loading and error states
    if (isLoading) {
        return <div>Loading...</div>
    }
    if (isError || !articles) {
        return <div>Error loading articles</div>
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
