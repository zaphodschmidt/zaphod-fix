import type { ChartConfig } from '@/components/ui/chart'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

export type WeeklyTrendDatum = { week: string; completions: number }

export function WeeklyTrendChart({
  data,
  config,
  heightClassName = 'h-[200px]',
}: {
  data: WeeklyTrendDatum[]
  config: ChartConfig
  heightClassName?: string
}) {
  return (
    <ChartContainer config={config} className={`${heightClassName} w-full`}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="fillWeekly" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-completions)" stopOpacity={0.6} />
            <stop offset="95%" stopColor="var(--color-completions)" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="completions"
          stroke="var(--color-completions)"
          fill="url(#fillWeekly)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}


