import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { streaksListOptions } from '@/api/@tanstack/react-query.gen'
import {
  IconFlame,
  IconTrophy,
  IconCalendarStats,
  IconChartBar,
  IconTarget,
} from '@tabler/icons-react'
import type { ChartConfig } from '@/components/ui/chart'
import { StatCard } from '@/components/stats/StatCard'
import { ChartCard } from '@/components/stats/ChartCard'
import { DailyActivityChart } from '@/components/stats/charts/DailyActivityChart'
import { DayOfWeekChart } from '@/components/stats/charts/DayOfWeekChart'
import { StreakComparisonChart } from '@/components/stats/charts/StreakComparisonChart'
import { WeeklyTrendChart } from '@/components/stats/charts/WeeklyTrendChart'
import { InsightsPanel } from '@/components/stats/InsightsPanel'
import { StreakPerformanceGrid } from '@/components/stats/StreakPerformanceGrid'
import { useStreakStats } from '@/hooks/useStreakStats'

export const Route = createFileRoute('/stats')({
  component: StatsPage,
})

function StatsPage() {
  const { data: streaks, isLoading } = useQuery(streaksListOptions({}))

  const stats = useStreakStats(streaks)

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
      color: "var(--primary)",
    },
  } satisfies ChartConfig

  const dayOfWeekConfig = {
    completions: {
      label: "Completions",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig

  const streakComparisonConfig = {
    current: {
      label: "Current Streak",
      color: "var(--primary)",
    },
    longest: {
      label: "Longest Streak",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig

  const mostActiveDayLabel =
    stats.dayOfWeekData.reduce(
      (max, d) => (d.completions > max.completions ? d : max),
      stats.dayOfWeekData[0]
    ).day

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
            <DailyActivityChart data={stats.last30Days} config={activityChartConfig} />
          </ChartCard>

          {/* Day of Week Distribution */}
          <ChartCard
            title="Day of Week Patterns"
            description="When you're most productive"
          >
            <DayOfWeekChart data={stats.dayOfWeekData} config={dayOfWeekConfig} />
          </ChartCard>
        </section>

        {/* Streak Comparison */}
        <section>
          <ChartCard
            title="Streak Comparison"
            description="Current vs longest streaks for each habit"
          >
            <StreakComparisonChart data={stats.streakComparison} config={streakComparisonConfig} />
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
            <WeeklyTrendChart data={stats.weeklyData} config={activityChartConfig} />
          </ChartCard>

          {/* Motivational Insights */}
          <ChartCard
            title="🧠 Insights"
            description="Your addiction working for you"
          >
            <InsightsPanel
              totalCurrentStreak={stats.totalCurrentStreak}
              mostActiveDayLabel={mostActiveDayLabel}
              completionsLast7={stats.completionsLast7}
            />
          </ChartCard>
        </section>

        {/* Individual Streak Performance */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Individual Streak Performance</h2>
          {streaks && <StreakPerformanceGrid streaks={streaks} />}
        </section>
      </div>
    </div>
  )
}