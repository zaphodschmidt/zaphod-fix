import type { ChartConfig } from '@/components/ui/chart'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

export type DayOfWeekDatum = { day: string; completions: number }

export function DayOfWeekChart({
  data,
  config,
  heightClassName = 'h-[250px]',
}: {
  data: DayOfWeekDatum[]
  config: ChartConfig
  heightClassName?: string
}) {
  return (
    <ChartContainer config={config} className={`${heightClassName} w-full`}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="completions" fill="var(--color-completions)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}


