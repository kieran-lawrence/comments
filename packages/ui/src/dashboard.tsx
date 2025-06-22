import { BarChartComponent } from './barChart'
import { EnagementSummary } from './engagementSummary'
import { LineChartComponent } from './lineChart'
import { TrendingConversations } from './trendingConversations'

export const CommentsDashboard = () => {
    return (
        <div className="flex flex-col gap-4">
            <section className="grid grid-cols-2 gap-4">
                <EnagementSummary />
                <LineChartComponent />
            </section>
            <section className="p-4 border border-black/25 rounded-xl shadow-sm">
                <BarChartComponent />
            </section>
            <TrendingConversations />
        </div>
    )
}
