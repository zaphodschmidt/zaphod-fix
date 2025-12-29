import type { Completion, Streak } from '@/api'
import { useMemo } from 'react'

export type CompletionWithStreak = Completion & { streakName: string; streakColor: string }

export type StreakStats = {
  totalStreaks: number
  totalCompletions: number
  totalCurrentStreak: number
  longestStreak: number
  bestStreak?: Streak
  dayOfWeekData: { day: string; completions: number }[]
  last30Days: { date: string; completions: number }[]
  streakComparison: {
    name: string
    fullName: string
    current: number
    longest: number
    total: number
    color: string
  }[]
  completionRate: number
  weeklyData: { week: string; completions: number }[]
  completionsLast7: number
  allCompletions: CompletionWithStreak[]
}

function toDateOnlyIso(date: Date) {
  return date.toISOString().slice(0, 10)
}

export function useStreakStats(streaks?: Streak[] | null): StreakStats | null {
  return useMemo(() => {
    if (!streaks || streaks.length === 0) return null

    const allCompletions: CompletionWithStreak[] = []
    for (const streak of streaks) {
      for (const c of streak.completions) {
        allCompletions.push({
          ...c,
          streakName: streak.name,
          streakColor: streak.color,
        })
      }
    }

    allCompletions.sort(
      (a, b) => new Date(a.date_completed).getTime() - new Date(b.date_completed).getTime()
    )

    const totalStreaks = streaks.length
    const totalCompletions = allCompletions.length
    const totalCurrentStreak = streaks.reduce((sum, s) => sum + s.current_streak, 0)
    const longestStreak = Math.max(...streaks.map((s) => s.longest_streak))
    const bestStreak = streaks.find((s) => s.longest_streak === longestStreak)

    // Day-of-week distribution (Mon-Sun)
    const dayOfWeekCounts = [0, 0, 0, 0, 0, 0, 0]
    for (const c of allCompletions) {
      const day = c.day_of_week ?? new Date(c.date_completed).getDay()
      const adjustedDay = day === 0 ? 6 : day - 1
      dayOfWeekCounts[adjustedDay]++
    }
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const dayOfWeekData = dayNames.map((name, i) => ({ day: name, completions: dayOfWeekCounts[i] }))

    // Fast lookup: completions by date (YYYY-MM-DD)
    const completionsByDate = new Map<string, number>()
    for (const c of allCompletions) {
      completionsByDate.set(c.date_completed, (completionsByDate.get(c.date_completed) ?? 0) + 1)
    }

    const today = new Date()

    // Last 30 days (display labels)
    const last30Days: { date: string; completions: number }[] = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const iso = toDateOnlyIso(d)
      last30Days.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completions: completionsByDate.get(iso) ?? 0,
      })
    }

    // Streak comparison
    const streakComparison = streaks
      .map((s) => ({
        name: s.name.length > 12 ? s.name.slice(0, 12) + '...' : s.name,
        fullName: s.name,
        current: s.current_streak,
        longest: s.longest_streak,
        total: s.days_completed,
        color: s.color,
      }))
      .sort((a, b) => b.current - a.current)

    // Completion rate (last 7 days)
    const last7Days = new Set<string>()
    for (let i = 0; i < 7; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      last7Days.add(toDateOnlyIso(d))
    }
    const completionsLast7 = allCompletions.reduce(
      (acc, c) => (last7Days.has(c.date_completed) ? acc + 1 : acc),
      0
    )
    const possibleCompletions = totalStreaks * 7
    const completionRate =
      possibleCompletions > 0 ? Math.round((completionsLast7 / possibleCompletions) * 100) : 0

    // Weekly trend (last 8 weeks)
    const completionDates = allCompletions.map((c) => new Date(c.date_completed))
    const weeklyData: { week: string; completions: number }[] = []
    for (let w = 7; w >= 0; w--) {
      const weekStart = new Date(today)
      weekStart.setDate(weekStart.getDate() - w * 7 - weekStart.getDay() + 1)
      weekStart.setHours(0, 0, 0, 0)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)
      weekEnd.setHours(23, 59, 59, 999)

      let weekCompletions = 0
      for (const d of completionDates) {
        if (d >= weekStart && d <= weekEnd) weekCompletions++
      }

      weeklyData.push({
        week: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completions: weekCompletions,
      })
    }

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
      completionsLast7,
      allCompletions,
    }
  }, [streaks])
}


