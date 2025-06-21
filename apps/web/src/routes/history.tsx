import { CommentStatusChangesTable, PageLayout } from '@repo/ui'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { getStatusChanges } from '../services/api'

export const Route = createFileRoute('/history')({
    component: HistoryPage,
})

function HistoryPage() {
    const {
        data: commentStatusChanges,
        isLoading,
        isError,
        // refetch,
    } = useQuery({
        queryKey: ['getCommentStatusChangesKey'],
        queryFn: getStatusChanges,
    })

    // TODO: Add loading and error states
    if (isLoading) {
        return <div>Loading...</div>
    }
    if (isError || !commentStatusChanges) {
        return <div>Error loading comment status history</div>
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
