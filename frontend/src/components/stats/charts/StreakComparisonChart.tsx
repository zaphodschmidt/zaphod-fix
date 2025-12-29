import type { ChartConfig } from '@/components/ui/chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

export type StreakComparisonDatum = {
  name: string
  fullName: string
  current: number
  longest: number
  total: number
  color: string
}

export function StreakComparisonChart({
  data,
  config,
  heightClassName = 'h-[300px]',
}: {
  data: StreakComparisonDatum[]
  config: ChartConfig
  heightClassName?: string
}) {
  return (
    <ChartContainer config={config} className={`${heightClassName} w-full`}>
      <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={100}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="current" fill="var(--color-current)" radius={[0, 4, 4, 0]} />
        <Bar dataKey="longest" fill="var(--color-longest)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ChartContainer>
  )
}


