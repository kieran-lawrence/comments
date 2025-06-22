import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from './chart'

const chartData = [
    { time: '6pm', commentCount: 23 },
    { time: '8pm', commentCount: 37 },
    { time: '10pm', commentCount: 19 },
    { time: '12am', commentCount: 3 },
    { time: '2am', commentCount: 2 },
    { time: '6am', commentCount: 9 },
    { time: '8am', commentCount: 13 },
    { time: '10am', commentCount: 8 },
    { time: '12pm', commentCount: 17 },
    { time: '2pm', commentCount: 16 },
    { time: '4pm', commentCount: 22 },
]

const chartConfig = {
    commentCount: {
        label: 'Comment Count: ',
    },
} satisfies ChartConfig

export const LineChartComponent = () => {
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
                            tickMargin={4}
                        />
                        <ChartTooltip
                            cursor={true}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Line
                            dataKey="commentCount"
                            type="natural"
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
