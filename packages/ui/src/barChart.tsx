import {
    ChartContainer,
    type ChartConfig,
    ChartTooltip,
    ChartTooltipContent,
} from './chart'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

const chartData = [
    { month: 'Monday', members: 9 },
    { month: 'Tuesday', members: 3 },
    { month: 'Wednesday', members: 6 },
    { month: 'Thursday', members: 2 },
    { month: 'Friday', members: 0 },
    { month: 'Saturday', members: 0 },
    { month: 'Sunday', members: 1 },
]

const chartConfig = {
    members: {
        label: 'Members Joined: ',
    },
} satisfies ChartConfig

export const BarChartComponent = () => {
    return (
        <ChartContainer config={chartConfig} className="max-h-64 w-full">
            <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                    dataKey="members"
                    fill="var(--color-graph-primary)"
                    radius={4}
                />
            </BarChart>
        </ChartContainer>
    )
}
