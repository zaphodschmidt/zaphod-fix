import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { streaksListOptions } from '@/api/@tanstack/react-query.gen'
import type { Streak, Completion } from '@/api'
import { useMemo } from 'react'
import {
  IconFlame,
  IconTrophy,
  IconCalendarStats,
  IconChartBar,
  IconTarget,
  IconTrendingUp,
  IconClock,
  IconCalendarWeek,
} from '@tabler/icons-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts'
import type { ChartConfig } from '@/components/ui/chart'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { cn } from '@/lib/utils'
import { COLOR_CLASSES } from '@/lib/colors'

export const Route = createFileRoute('/stats')({
  component: StatsPage,
})

// Stats card component
function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: typeof IconFlame
  label: string
  value: string | number
  subtext?: string
  color: string
}) {
  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-5 transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subtext && (
            <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
          )}
        </div>
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", color)}>
          <Icon className="w-6 h-6 text-white" stroke={2} />
        </div>
      </div>
    </div>
  )
}

// Chart card wrapper
function ChartCard({
  title,
  description,
  children,
  className,
}: {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn(
      "bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-5 transition-all duration-300 hover:border-border",
      className
    )}>
      <div className="mb-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  )
}

function StatsPage() {
  const { data: streaks, isLoading } = useQuery(streaksListOptions({}))

  // Calculate all statistics
  const stats = useMemo(() => {
    if (!streaks || streaks.length === 0) {
      return null
    }

    // Aggregate all completions
    const allCompletions: (Completion & { streakName: string; streakColor: string })[] = []
    streaks.forEach((streak: Streak) => {
      streak.completions.forEach((c: Completion) => {
        allCompletions.push({
          ...c,
          streakName: streak.name,
          streakColor: streak.color,
        })
      })
    })

    // Sort completions by date
    allCompletions.sort((a, b) => 
      new Date(a.date_completed).getTime() - new Date(b.date_completed).getTime()
    )

    // Basic stats
    const totalStreaks = streaks.length
    const totalCompletions = allCompletions.length
    const totalCurrentStreak = streaks.reduce((sum, s) => sum + s.current_streak, 0)
    const longestStreak = Math.max(...streaks.map(s => s.longest_streak))
    const bestStreak = streaks.find(s => s.longest_streak === longestStreak)

    // Activity by day of week
    const dayOfWeekCounts = [0, 0, 0, 0, 0, 0, 0] // Mon-Sun
    allCompletions.forEach(c => {
      const day = c.day_of_week ?? new Date(c.date_completed).getDay()
      // Convert Sunday (0) to 6, and shift others
      const adjustedDay = day === 0 ? 6 : day - 1
      dayOfWeekCounts[adjustedDay]++
    })

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const dayOfWeekData = dayNames.map((name, i) => ({
      day: name,
      completions: dayOfWeekCounts[i],
    }))

    // Activity over time (last 30 days)
    const last30Days: { date: string; completions: number }[] = []
    const today = new Date()
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().slice(0, 10)
      const count = allCompletions.filter(c => c.date_completed === dateStr).length
      last30Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completions: count,
      })
    }

    // Streak comparison data
    const streakComparison = streaks.map((s: Streak) => ({
      name: s.name.length > 12 ? s.name.slice(0, 12) + '...' : s.name,
      fullName: s.name,
      current: s.current_streak,
      longest: s.longest_streak,
      total: s.days_completed,
      color: s.color,
    })).sort((a, b) => b.current - a.current)

    // Completion rate (last 7 days)
    const last7Days = new Set<string>()
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      last7Days.add(date.toISOString().slice(0, 10))
    }
    const completionsLast7 = allCompletions.filter(c => last7Days.has(c.date_completed)).length
    const possibleCompletions = totalStreaks * 7
    const completionRate = possibleCompletions > 0 
      ? Math.round((completionsLast7 / possibleCompletions) * 100) 
      : 0

    // Weekly trend data (last 8 weeks)
    const weeklyData: { week: string; completions: number }[] = []
    for (let w = 7; w >= 0; w--) {
      const weekStart = new Date(today)
      weekStart.setDate(weekStart.getDate() - (w * 7) - weekStart.getDay() + 1)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)
      
      const weekCompletions = allCompletions.filter(c => {
        const d = new Date(c.date_completed)
        return d >= weekStart && d <= weekEnd
      }).length

      weeklyData.push({
        week: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completions: weekCompletions,
      })
    }

    // Streak health (radial chart data)
    const streakHealth = streaks.map((s: Streak) => {
      const healthScore = s.current_streak > 0 
        ? Math.min(100, Math.round((s.current_streak / Math.max(s.longest_streak, 7)) * 100))
        : 0
      return {
        name: s.name,
        health: healthScore,
        fill: `var(--color-${s.color})`,
      }
    }).sort((a, b) => b.health - a.health).slice(0, 5)

    return {
      totalStreaks,
      totalCompletions,
      totalCurrentStreak,
      longestStreak,
      bestStreak,
      dayOfWeekData,
      last30Days,
      streakComparison,
      completionRate,
      weeklyData,
      streakHealth,
      completionsLast7,
    }
  }, [streaks])

  if (isLoading) {
    return (
      <div className="flex-1 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-12 w-64 bg-muted/50 rounded-lg mb-8 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-muted/30 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <IconChartBar className="w-10 h-10 text-primary" stroke={1.5} />
          </div>
          <h2 className="text-2xl font-bold mb-3">No Data Yet</h2>
          <p className="text-muted-foreground">
            Start tracking your streaks to see your statistics. Each completion brings you closer to mastering your habits!
          </p>
        </div>
      </div>
    )
  }

  // Chart configs
  const activityChartConfig = {
    completions: {
      label: "Completions",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig

  const dayOfWeekConfig = {
    completions: {
      label: "Completions",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  const streakComparisonConfig = {
    current: {
      label: "Current Streak",
      color: "hsl(var(--primary))",
    },
    longest: {
      label: "Longest Streak",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig

  return (
    <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            <span className="text-gradient">Statistics</span>
          </h1>
          <p className="text-muted-foreground">
            Track your progress, identify patterns, and stay motivated. Your addiction to improvement, visualized.
          </p>
        </header>

        {/* Top Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={IconFlame}
            label="Active Streaks"
            value={stats.totalStreaks}
            subtext="Habits being tracked"
            color="bg-gradient-to-br from-orange-500 to-red-600"
          />
          <StatCard
            icon={IconCalendarStats}
            label="Total Completions"
            value={stats.totalCompletions}
            subtext="All-time logged days"
            color="bg-gradient-to-br from-primary to-accent"
          />
          <StatCard
            icon={IconTrophy}
            label="Longest Streak"
            value={`${stats.longestStreak} days`}
            subtext={stats.bestStreak ? `🏆 ${stats.bestStreak.name}` : undefined}
            color="bg-gradient-to-br from-amber-500 to-yellow-600"
          />
          <StatCard
            icon={IconTarget}
            label="7-Day Rate"
            value={`${stats.completionRate}%`}
            subtext={`${stats.completionsLast7} of ${stats.totalStreaks * 7} possible`}
            color="bg-gradient-to-br from-emerald-500 to-green-600"
          />
        </section>

        {/* Activity Charts Row */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Last 30 Days Activity */}
          <ChartCard
            title="Daily Activity"
            description="Completions over the last 30 days"
            className="lg:col-span-1"
          >
            <ChartContainer config={activityChartConfig} className="h-[250px] w-full">
              <AreaChart data={stats.last30Days} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                  tickFormatter={(value) => value.split(' ')[1]}
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
          </ChartCard>

          {/* Day of Week Distribution */}
          <ChartCard
            title="Day of Week Patterns"
            description="When you're most productive"
          >
            <ChartContainer config={dayOfWeekConfig} className="h-[250px] w-full">
              <BarChart data={stats.dayOfWeekData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="completions"
                  fill="var(--color-completions)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </ChartCard>
        </section>

        {/* Streak Comparison */}
        <section>
          <ChartCard
            title="Streak Comparison"
            description="Current vs longest streaks for each habit"
          >
            <ChartContainer config={streakComparisonConfig} className="h-[300px] w-full">
              <BarChart
                data={stats.streakComparison}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
              >
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
          </ChartCard>
        </section>

        {/* Weekly Trend & Insights */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Trend */}
          <ChartCard
            title="Weekly Trend"
            description="Completions per week (last 8 weeks)"
            className="lg:col-span-2"
          >
            <ChartContainer config={activityChartConfig} className="h-[200px] w-full">
              <AreaChart data={stats.weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
          </ChartCard>

          {/* Motivational Insights */}
          <ChartCard
            title="🧠 Insights"
            description="Your addiction working for you"
          >
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <IconTrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Total Combined Streak</span>
                </div>
                <p className="text-2xl font-bold">{stats.totalCurrentStreak} days</p>
                <p className="text-xs text-muted-foreground">Across all habits</p>
              </div>

              <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                <div className="flex items-center gap-2 text-accent mb-1">
                  <IconClock className="w-4 h-4" />
                  <span className="text-sm font-medium">Most Active Day</span>
                </div>
                <p className="text-2xl font-bold">
                  {stats.dayOfWeekData.reduce((max, d) => d.completions > max.completions ? d : max, stats.dayOfWeekData[0]).day}
                </p>
                <p className="text-xs text-muted-foreground">Your power day</p>
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2 text-emerald-500 mb-1">
                  <IconCalendarWeek className="w-4 h-4" />
                  <span className="text-sm font-medium">This Week</span>
                </div>
                <p className="text-2xl font-bold">{stats.completionsLast7} logs</p>
                <p className="text-xs text-muted-foreground">Keep the momentum!</p>
              </div>
            </div>
          </ChartCard>
        </section>

        {/* Individual Streak Performance */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Individual Streak Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {streaks?.map((streak: Streak) => {
              const colorSet = COLOR_CLASSES[streak.color] ?? COLOR_CLASSES.gray
              const healthPercent = streak.longest_streak > 0
                ? Math.round((streak.current_streak / streak.longest_streak) * 100)
                : streak.current_streak > 0 ? 100 : 0

              return (
                <div
                  key={streak.id}
                  className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 hover:border-border transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn("w-3 h-3 rounded-full", colorSet.bright)} />
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

                  {/* Health bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Streak Health</span>
                      <span className="font-medium">{Math.min(healthPercent, 100)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all", colorSet.bright)}
                        style={{ width: `${Math.min(healthPercent, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}

