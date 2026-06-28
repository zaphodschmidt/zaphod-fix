import { createFileRoute, redirect } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

import { logsListOptions } from '@/api/@tanstack/react-query.gen'
import type { Log } from '@/api/types.gen'
import { TimeLogInput, TimeLogTable } from '@/components/logs/TimeLog'
import { formatDayHeading, localDayOf } from '@/lib/format'

export const Route = createFileRoute('/logs')({
  beforeLoad: ({ location }) => {
    const token = sessionStorage.getItem('auth_token')
    if (!token) {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }
  },
  component: LogsPage,
})

type DayGroup = { day: string; items: Log[] }

function groupByDay(logs: Log[]): DayGroup[] {
  const map = new Map<string, Log[]>()
  for (const log of logs) {
    const day = localDayOf(log.created_at)
    const arr = map.get(day)
    if (arr) arr.push(log)
    else map.set(day, [log])
  }
  return Array.from(map.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1)) // newest day first
    .map(([day, items]) => ({
      day,
      items: [...items].reverse(), // chronological within the day
    }))
}

function LogsPage() {
  const { data: logs } = useQuery(logsListOptions())
  const groups = groupByDay(logs ?? [])

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <h1 className="text-2xl font-semibold">Time Log</h1>
        <TimeLogInput />
        {groups.length === 0 ? (
          <p className="text-muted-foreground text-sm">No logs yet.</p>
        ) : (
          groups.map(({ day, items }) => (
            <section
              key={day}
              className="border-border bg-card flex flex-col gap-2 rounded-2xl border p-4 shadow-sm sm:p-5"
            >
              <h2 className="text-lg font-semibold">{formatDayHeading(day)}</h2>
              <TimeLogTable logs={items} />
            </section>
          ))
        )}
      </div>
    </div>
  )
}
