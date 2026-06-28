import { createFileRoute, redirect } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import * as React from 'react'

import { tasksListOptions } from '@/api/@tanstack/react-query.gen'
import { TaskComposer } from '@/components/tasks/TaskComposer'
import { TaskItem } from '@/components/tasks/TaskItem'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/tasks')({
  beforeLoad: ({ location }) => {
    const token = sessionStorage.getItem('auth_token')
    if (!token) {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }
  },
  component: TasksPage,
})

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'todo', label: 'To do' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'done', label: 'Done' },
] as const

function TasksPage() {
  const [filter, setFilter] =
    React.useState<(typeof FILTERS)[number]['key']>('all')
  const { data: tasks, isLoading } = useQuery(tasksListOptions())

  const filtered = (tasks ?? []).filter((t) =>
    filter === 'all' ? true : t.status === filter
  )

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <h1 className="text-2xl font-semibold">Tasks</h1>

        <Card>
          <CardHeader>
            <CardTitle>New task</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskComposer />
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-1">
          {FILTERS.map((f) => (
            <Button
              key={f.key}
              size="sm"
              variant={filter === f.key ? 'secondary' : 'ghost'}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </Button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {isLoading ? (
            <p className="text-muted-foreground text-sm">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground text-sm">No tasks here.</p>
          ) : (
            filtered.map((t) => <TaskItem key={t.id} task={t} />)
          )}
        </div>
      </div>
    </div>
  )
}
