import { createFileRoute } from '@tanstack/react-router'
import DayBlockGrid from '@/components/DayBlockGrid'
import { useQuery } from '@tanstack/react-query'
import { streaksListOptions } from '@/api/@tanstack/react-query.gen'
import type { Streak } from '@/api'
import AddStreakDialog from '@/components/dialogs/AddStreakDialog'
import { IconFlame, IconTrophy, IconCalendarStats } from '@tabler/icons-react'

export const Route = createFileRoute('/')({
  component: Index,
})

function StatsCard({ 
  icon: Icon, 
  label, 
  value, 
  color 
}: { 
  icon: typeof IconFlame
  label: string
  value: string | number
  color: string 
}) {
  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 flex items-center gap-4 transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" stroke={2} />
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="flex-1 p-8 animate-pulse">
      <div className="max-w-6xl mx-auto">
        <div className="h-12 w-64 bg-muted/50 rounded-lg mb-2" />
        <div className="h-5 w-96 bg-muted/30 rounded mb-8" />
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-muted/30 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="h-64 bg-muted/30 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <IconFlame className="w-10 h-10 text-primary" stroke={1.5} />
        </div>
        <h2 className="text-2xl font-bold mb-3">Start Your First Streak</h2>
        <p className="text-muted-foreground mb-6">
          Build lasting habits by tracking your daily progress. Create your first streak to get started on your journey.
        </p>
        <AddStreakDialog />
      </div>
    </div>
  )
}

function Index() {
  const { data: streaks, isLoading } = useQuery(streaksListOptions({}))

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (!streaks || streaks.length === 0) {
    return <EmptyState />
  }

  // Calculate aggregate stats
  const totalStreaks = streaks.length
  const totalDays = streaks.reduce((sum, s) => sum + (s.days_completed ?? 0), 0)
  const longestStreak = Math.max(...streaks.map(s => s.longest_streak ?? 0))

  return (
    <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="fade-in-up">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                <span className="text-gradient">Dashboard</span>
              </h1>
              <p className="text-muted-foreground">
                Track your habits, build consistency, achieve your goals.
              </p>
            </div>
            <AddStreakDialog />
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 fade-in-up" style={{ animationDelay: '100ms' }}>
          <StatsCard 
            icon={IconFlame} 
            label="Activadsfe Streaks" 
            value={totalStreaks}
            color="bg-gradient-to-br from-orange-500 to-red-600"
          />
          <StatsCard 
            icon={IconCalendarStats} 
            label="Total Days Logged" 
            value={totalDays}
            color="bg-gradient-to-br from-primary to-accent"
          />
          <StatsCard 
            icon={IconTrophy} 
            label="Longest Streak" 
            value={longestStreak}
            color="bg-gradient-to-br from-amber-500 to-yellow-600"
          />
        </section>

        {/* Streaks Grid */}
        <section className="space-y-4 fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Your Streaks</h2>
            <span className="text-sm text-muted-foreground">{totalStreaks} active</span>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {streaks.map((streak: Streak, index: number) => (
              <div 
                key={streak.id} 
                className="fade-in-up" 
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                <DayBlockGrid 
                  sizeX={26} 
                  sizeY={7} 
                  streak={streak} 
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
