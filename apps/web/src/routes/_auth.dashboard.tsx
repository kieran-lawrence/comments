import { CommentsDashboard, LoadingOverlay, PageLayout } from '@repo/ui'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { getStatistics } from '../services/api'

export const Route = createFileRoute('/_auth/dashboard')({
    component: DashboardPage,
})

function DashboardPage() {
    const {
        data: statisticData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['getStatisticsKey'],
        queryFn: getStatistics,
    })

    // TODO: Add loading and error states
    if (isLoading) {
        return <LoadingOverlay />
    }
    if (isError || !statisticData) {
        return <div>Error loading statistics</div>
    }

    return (
        <PageLayout
            mainContent={<CommentsDashboard statistics={statisticData} />}
        />
    )
}
