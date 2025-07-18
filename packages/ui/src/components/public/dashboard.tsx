import { StatisticsResponse } from '@repo/shared-types'
import { BarChartComponent } from '../barChart'
import { EnagementSummary } from '../engagementSummary'
import { LineChartComponent } from '../lineChart'
import { TrendingConversations } from '../trendingConversations'

export const CommentsDashboard = ({
    statistics,
}: {
    statistics: StatisticsResponse
}) => {
    const {
        newUsersLast7Days,
        commentsLast24Hours,
        topCommentsToday,
        ...engagementSummaryProps
    } = statistics

    return (
        <div className="grid grid-cols-1 grid-rows-[auto_30rem_auto] gap-4 h-full min-h-0">
            <section className="grid grid-cols-2 gap-4">
                <EnagementSummary {...engagementSummaryProps} />
                <LineChartComponent commentsLast24Hours={commentsLast24Hours} />
            </section>
            <section className="flex flex-col gap-6 p-4 border border-black/25 rounded-xl shadow-sm min-h-0 max-h-[30rem]">
                <h2 className="textTitleItemMd text-text-primary">
                    New Users This Week
                </h2>
                <BarChartComponent newUsersLast7Days={newUsersLast7Days} />
            </section>
            <TrendingConversations topCommentsToday={topCommentsToday} />
        </div>
    )
}
