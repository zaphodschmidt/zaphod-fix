import type { Streak } from '@/api'
import { COLOR_CLASSES } from '@/lib/colors'
import { cn } from '@/lib/utils'

export function StreakPerformanceGrid({ streaks }: { streaks: Streak[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {streaks.map((streak) => {
        const colorSet = COLOR_CLASSES[streak.color] ?? COLOR_CLASSES.gray
        const healthPercent =
          streak.longest_streak > 0
            ? Math.round((streak.current_streak / streak.longest_streak) * 100)
            : streak.current_streak > 0
              ? 100
              : 0

        return (
          <div
            key={streak.id}
            className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 hover:border-border transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={cn('w-3 h-3 rounded-full', colorSet.bright)} />
              <h4 className="font-medium truncate">{streak.name}</h4>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center mb-3">
              <div>
                <p className="text-xl font-bold text-primary">{streak.current_streak}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Current</p>
              </div>
              <div>
                <p className="text-xl font-bold text-amber-500">{streak.longest_streak}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Longest</p>
              </div>
              <div>
                <p className="text-xl font-bold">{streak.days_completed}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Total</p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Streak Health</span>
                <span className="font-medium">{Math.min(healthPercent, 100)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all', colorSet.bright)}
                  style={{ width: `${Math.min(healthPercent, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}


