import type { ChartConfig } from '@/components/ui/chart'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

export type DailyActivityDatum = { date: string; completions: number }

export function DailyActivityChart({
  data,
  config,
  heightClassName = 'h-[250px]',
}: {
  data: DailyActivityDatum[]
  config: ChartConfig
  heightClassName?: string
}) {
  return (
    <ChartContainer config={config} className={`${heightClassName} w-full`}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="fillCompletions" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-completions)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-completions)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => `${value}`.split(' ')[1]}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="completions"
          stroke="var(--color-completions)"
          fill="url(#fillCompletions)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}


