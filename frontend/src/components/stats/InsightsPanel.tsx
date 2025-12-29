import { IconCalendarWeek, IconClock, IconTrendingUp } from '@tabler/icons-react'

export function InsightsPanel({
  totalCurrentStreak,
  mostActiveDayLabel,
  completionsLast7,
}: {
  totalCurrentStreak: number
  mostActiveDayLabel: string
  completionsLast7: number
}) {
  return (
    <div className="space-y-4">
      <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
        <div className="flex items-center gap-2 text-primary mb-1">
          <IconTrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">Total Combined Streak</span>
        </div>
        <p className="text-2xl font-bold">{totalCurrentStreak} days</p>
        <p className="text-xs text-muted-foreground">Across all habits</p>
      </div>

      <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
        <div className="flex items-center gap-2 text-accent mb-1">
          <IconClock className="w-4 h-4" />
          <span className="text-sm font-medium">Most Active Day</span>
        </div>
        <p className="text-2xl font-bold">{mostActiveDayLabel}</p>
        <p className="text-xs text-muted-foreground">Your power day</p>
      </div>

      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
        <div className="flex items-center gap-2 text-emerald-500 mb-1">
          <IconCalendarWeek className="w-4 h-4" />
          <span className="text-sm font-medium">This Week</span>
        </div>
        <p className="text-2xl font-bold">{completionsLast7} logs</p>
        <p className="text-xs text-muted-foreground">Keep the momentum!</p>
      </div>
    </div>
  )
}


