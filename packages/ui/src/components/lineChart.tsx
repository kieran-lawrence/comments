import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from './radix/card'
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from './radix/chart'
import { RecentCommentsResponse } from '@repo/shared-types'
import { format } from 'date-fns'

const chartConfig = {
    commentCount: {
        label: 'Comment Count: ',
    },
} satisfies ChartConfig

export const LineChartComponent = ({
    commentsLast24Hours,
}: {
    commentsLast24Hours: RecentCommentsResponse[]
}) => {
    // Transform the data to match the expected format for the chart
    const chartData = commentsLast24Hours.map(({ hour, commentCount }) => ({
        time: format(new Date(hour), 'h a'),
        commentCount,
    }))
    return (
        <Card>
            <CardHeader>
                <CardTitle className="textTitleItemMd text-text-primary">
                    Recent Comment Activity
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="time"
                            tickLine={true}
                            axisLine={false}
                            tickMargin={12}
                        />
                        <YAxis width={5} />
                        <ChartTooltip
                            cursor={true}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Line
                            dataKey="commentCount"
                            type="monotone"
                            stroke="var(--color-graph-primary)"
                            strokeWidth={2}
                            dot={{
                                fill: 'var(--color-graph-primary)',
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
