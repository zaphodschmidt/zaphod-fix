import { createFileRoute } from '@tanstack/react-router'
import DayBlockGrid from '@/components/DayBlockGrid'
import { useQuery } from '@tanstack/react-query'
import { streaksListOptions } from '@/api/@tanstack/react-query.gen'
import type { Streak } from '@/api'
import AddStreakDialog from '@/components/dialogs/AddStreakDialog'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const { data: streaks, isLoading } = useQuery(streaksListOptions({}))

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (!streaks) {
    return <div>No streaks found</div>
  }
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <AddStreakDialog />
      {streaks.map((streak: Streak) => (
        <DayBlockGrid key={streak.id} sizeX={7} sizeY={7} streak={streak} color={streak.color} />
      ))}
    </div>
  )
}