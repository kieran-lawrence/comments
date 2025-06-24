import { NewUserResponse } from '@repo/shared-types'
import {
    ChartContainer,
    type ChartConfig,
    ChartTooltip,
    ChartTooltipContent,
} from './chart'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { format } from 'date-fns'

const chartConfig = {
    members: {
        label: 'Members Joined: ',
    },
} satisfies ChartConfig

export const BarChartComponent = ({
    newUsersLast7Days,
}: {
    newUsersLast7Days: NewUserResponse[]
}) => {
    const chartData = newUsersLast7Days.map((user) => ({
        day: format(new Date(user.date), 'EEE'),
        members: user.userCount,
    }))
    return (
        <ChartContainer config={chartConfig} className="grow min-h-0 w-full">
            <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="day"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis width={10} />
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
