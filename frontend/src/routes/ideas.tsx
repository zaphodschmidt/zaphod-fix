import { createFileRoute, redirect } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

import { ideasListOptions } from '@/api/@tanstack/react-query.gen'
import type { Idea } from '@/api/types.gen'
import { IdeaInput, IdeaTable } from '@/components/ideas/IdeaLog'
import { formatDayHeading, localDayOf } from '@/lib/format'

export const Route = createFileRoute('/ideas')({
  beforeLoad: ({ location }) => {
    const token = sessionStorage.getItem('auth_token')
    if (!token) {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }
  },
  component: IdeasPage,
})

function groupByDay(ideas: Idea[]) {
  const map = new Map<string, Idea[]>()
  for (const idea of ideas) {
    const day = localDayOf(idea.created_at)
    const arr = map.get(day)
    if (arr) arr.push(idea)
    else map.set(day, [idea])
  }
  return Array.from(map.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([day, items]) => ({ day, items: [...items].reverse() }))
}

function IdeasPage() {
  const { data: ideas } = useQuery(ideasListOptions())
  const groups = groupByDay(ideas ?? [])

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <h1 className="text-2xl font-semibold">Ideas</h1>
        <IdeaInput />
        {groups.length === 0 ? (
          <p className="text-muted-foreground text-sm">No ideas yet.</p>
        ) : (
          groups.map(({ day, items }) => (
            <section
              key={day}
              className="border-border bg-card flex flex-col gap-2 rounded-2xl border p-4 shadow-sm sm:p-5"
            >
              <h2 className="text-lg font-semibold">{formatDayHeading(day)}</h2>
              <IdeaTable ideas={items} />
            </section>
          ))
        )}
      </div>
    </div>
  )
}
