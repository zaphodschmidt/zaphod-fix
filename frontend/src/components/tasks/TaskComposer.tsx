import * as React from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IconPlus } from "@tabler/icons-react"

import type { PriorityEnum } from "@/api/types.gen"
import {
  tasksCreateMutation,
  tasksListOptions,
} from "@/api/@tanstack/react-query.gen"
import { MarkdownField } from "@/components/MarkdownField"
import { PrioritySelect } from "@/components/tasks/PrioritySelect"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { dateTimeOnDayISO, todayISO } from "@/lib/format"
import { DEFAULT_PRIORITY } from "@/lib/priority"

/**
 * Form to create a task: title + expected time (hrs + min) + Eisenhower
 * priority. When `day` is a past date, the task is backfilled onto that day.
 */
export function TaskComposer({ day }: { day?: string }) {
  const queryClient = useQueryClient()
  const [title, setTitle] = React.useState("")
  const [hrs, setHrs] = React.useState("")
  const [min, setMin] = React.useState("")
  const [priority, setPriority] = React.useState<PriorityEnum>(DEFAULT_PRIORITY)
  const [description, setDescription] = React.useState("")
  const [showDesc, setShowDesc] = React.useState(false)

  const create = useMutation({
    ...tasksCreateMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksListOptions().queryKey })
      setTitle("")
      setHrs("")
      setMin("")
      setPriority(DEFAULT_PRIORITY)
      setDescription("")
      setShowDesc(false)
    },
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    const totalMinutes = (Number(hrs) || 0) * 60 + (Number(min) || 0)
    const backfill = day && day !== todayISO()
    create.mutate({
      body: {
        title: title.trim(),
        expected_minutes: totalMinutes > 0 ? totalMinutes : null,
        priority,
        description: description.trim(),
        ...(backfill ? { created_at: dateTimeOnDayISO(day) } : {}),
      },
    })
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What are you working on?"
          className="min-w-48 flex-1"
        />
        <Input
          type="number"
          min={0}
          value={hrs}
          onChange={(e) => setHrs(e.target.value)}
          placeholder="hrs"
          aria-label="Expected hours"
          className="w-16"
        />
        <Input
          type="number"
          min={0}
          max={59}
          value={min}
          onChange={(e) => setMin(e.target.value)}
          placeholder="min"
          aria-label="Expected minutes"
          className="w-16"
        />
        <Button type="submit" disabled={!title.trim() || create.isPending}>
          <IconPlus data-icon="inline-start" />
          Add
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-xs">Priority</span>
        <PrioritySelect value={priority} onChange={setPriority} />
      </div>
      {showDesc ? (
        <MarkdownField
          value={description}
          onChange={setDescription}
          placeholder="What's going on? Notes / context (markdown)…"
          rows={4}
        />
      ) : (
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground self-start text-xs"
          onClick={() => setShowDesc(true)}
        >
          + add description
        </button>
      )}
    </form>
  )
}
