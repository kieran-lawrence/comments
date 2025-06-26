import {
    CommentStatusChangesTable,
    ErrorComponent,
    LoadingOverlay,
    PageLayout,
} from '@repo/ui'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { getStatusChanges } from '../services/api'

export const Route = createFileRoute('/_auth/history')({
    component: HistoryPage,
    errorComponent: ({ error }) => (
        <ErrorComponent
            message={error.message}
            details={error.cause as string}
        />
    ),
})

function HistoryPage() {
    const {
        data: commentStatusChanges,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['getCommentStatusChangesKey'],
        queryFn: getStatusChanges,
    })

    if (isLoading) {
        return <LoadingOverlay />
    }
    if (isError || !commentStatusChanges) {
        throw new Error(
            `Encountered an issue while fetching comment history data.\n Please try again later or contact us if the problem persists.`,
            {
                cause: 'Error with query: getStatusChanges on /history route',
            },
        )
    }

    return (
        <PageLayout
            sidebar={<>Sidebar</>}
            mainContent={
                <CommentStatusChangesTable
                    statusChanges={commentStatusChanges}
                />
            }
        />
    )
}
