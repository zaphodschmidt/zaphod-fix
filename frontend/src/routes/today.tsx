import { createFileRoute, redirect } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'

import { tasksListOptions } from '@/api/@tanstack/react-query.gen'
import { CheckinSection } from '@/components/checkin/CheckinSection'
import { DayNavigator } from '@/components/DayNavigator'
import { IdeaLog } from '@/components/ideas/IdeaLog'
import { TimeLog } from '@/components/logs/TimeLog'
import { TaskComposer } from '@/components/tasks/TaskComposer'
import { TaskRow } from '@/components/tasks/TaskRow'
import { formatDayHeading, localDayOf, todayISO } from '@/lib/format'

export const Route = createFileRoute('/today')({
  beforeLoad: ({ location }) => {
    const token = sessionStorage.getItem('auth_token')
    if (!token) {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }
  },
  validateSearch: (search: Record<string, unknown>): { date?: string } => ({
    date: typeof search.date === 'string' ? search.date : undefined,
  }),
  component: Today,
})

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-border bg-card flex flex-col gap-3 rounded-2xl border p-4 shadow-sm sm:p-5">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  )
}

function Today() {
  const { date: dateParam } = Route.useSearch()
  const navigate = Route.useNavigate()
  const date = dateParam ?? todayISO()
  const isToday = date === todayISO()
  const setDate = (d: string) =>
    navigate({ search: d === todayISO() ? {} : { date: d } })

  const { data: tasks } = useQuery(tasksListOptions())
  const dayTasks = (tasks ?? []).filter((t) => localDayOf(t.created_at) === date)
  const todos = dayTasks.filter((t) => t.status !== 'done')
  const done = dayTasks.filter((t) => t.status === 'done')

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-5">
        <div className="border-border bg-card flex flex-col gap-2 rounded-2xl border p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-2xl font-semibold">{isToday ? 'Today' : 'Day'}</h1>
            <DayNavigator date={date} onChange={setDate} />
          </div>
          <p className="text-muted-foreground text-sm">{formatDayHeading(date)}</p>
        </div>

        <Section title="Time Log">
          <TimeLog day={date} />
        </Section>

        <Section title="Todos">
          <TaskComposer day={date} />
          <div className="flex flex-col">
            {todos.length === 0 && done.length === 0 ? (
              <p className="text-muted-foreground text-sm">Nothing yet.</p>
            ) : (
              <>
                {todos.map((t) => (
                  <TaskRow key={t.id} task={t} />
                ))}
                {done.map((t) => (
                  <TaskRow key={t.id} task={t} />
                ))}
              </>
            )}
          </div>
        </Section>

        <Section title="Ideas">
          <IdeaLog day={date} />
        </Section>

        <Section title="Reflections">
          <CheckinSection date={date} />
        </Section>
      </div>
    </div>
  )
}
