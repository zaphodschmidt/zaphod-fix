import { createFileRoute } from '@tanstack/react-router'
import DayBlockGrid from '@/components/DayBlockGrid'
import { useQuery } from '@tanstack/react-query'
import { streaksListOptions } from '@/api/@tanstack/react-query.gen'
import { useEffect, useState } from 'react'
import type { Streak } from '@/api'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const { data: streaks, isLoading } = useQuery(streaksListOptions({}))
  const [streak, setStreak] = useState<Streak[] >([])

  useEffect(() => {
    if (streaks) {
      setStreak(streaks)
    }
  }, [streaks])

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (!streaks) {
    return <div>No streaks found</div>
  }

  console.log(streaks)

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      {streak.map((streak: Streak) => (
        <DayBlockGrid key={streak.id} sizeX={7} sizeY={7} streak={streak} />
      ))}
    </div>
  )
}