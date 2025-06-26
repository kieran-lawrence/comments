import {
    CommentsDashboard,
    ErrorComponent,
    LoadingOverlay,
    PageLayout,
} from '@repo/ui'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { getStatistics } from '../services/api'

export const Route = createFileRoute('/_auth/dashboard')({
    component: DashboardPage,
    errorComponent: ({ error }) => (
        <ErrorComponent
            message={error.message}
            details={error.cause as string}
        />
    ),
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

    if (isLoading) {
        return <LoadingOverlay />
    }
    if (isError || !statisticData) {
        throw new Error(
            `Encountered an issue while fetching dashboard data.\n Please try again later or contact us if the problem persists.`,
            {
                cause: 'Error with query: getStatistics on /dashboard route',
            },
        )
    }

    return (
        <PageLayout
            mainContent={<CommentsDashboard statistics={statisticData} />}
        />
    )
}
