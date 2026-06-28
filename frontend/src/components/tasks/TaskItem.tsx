import * as React from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IconCheck, IconPencil, IconTrash, IconX } from "@tabler/icons-react"

import {
  tasksDestroyMutation,
  tasksListOptions,
  tasksPartialUpdateMutation,
} from "@/api/@tanstack/react-query.gen"
import type { PriorityEnum, Task } from "@/api/types.gen"
import { Markdown } from "@/components/Markdown"
import { MarkdownField } from "@/components/MarkdownField"
import { PriorityBadge, PrioritySelect } from "@/components/tasks/PrioritySelect"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatMinutes } from "@/lib/format"
import { DEFAULT_PRIORITY } from "@/lib/priority"

const STATUS_LABELS: Record<string, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
}

/** A single task row with status toggling, inline editing, and delete. */
export function TaskItem({ task }: { task: Task }) {
  const queryClient = useQueryClient()
  const [editing, setEditing] = React.useState(false)
  const [title, setTitle] = React.useState(task.title)
  const [expected, setExpected] = React.useState(
    task.expected_minutes?.toString() ?? ""
  )
  const [actual, setActual] = React.useState(task.actual_minutes?.toString() ?? "")
  const [description, setDescription] = React.useState(task.description ?? "")
  const [priority, setPriority] = React.useState<PriorityEnum>(
    task.priority ?? DEFAULT_PRIORITY
  )

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: tasksListOptions().queryKey })

  const update = useMutation({ ...tasksPartialUpdateMutation(), onSuccess: invalidate })
  const destroy = useMutation({ ...tasksDestroyMutation(), onSuccess: invalidate })

  const isDone = task.status === "done"

  const setStatus = (status: Task["status"]) =>
    update.mutate({
      path: { id: task.id },
      body: {
        status,
        completed_at: status === "done" ? new Date().toISOString() : null,
      },
    })

  const saveEdits = () => {
    update.mutate({
      path: { id: task.id },
      body: {
        title: title.trim() || task.title,
        expected_minutes: expected ? Number(expected) : null,
        actual_minutes: actual ? Number(actual) : null,
        priority,
        description,
      },
    })
    setEditing(false)
  }

  return (
    <div className="rounded-xl border p-3">
      <div className="flex items-start gap-2">
        <Button
          variant={isDone ? "default" : "outline"}
          size="icon-sm"
          aria-label="Toggle done"
          onClick={() => setStatus(isDone ? "todo" : "done")}
        >
          {isDone ? <IconCheck /> : null}
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={
                "font-medium " +
                (isDone ? "text-muted-foreground line-through" : "")
              }
            >
              {task.title}
            </span>
            <Badge variant="secondary">
              {STATUS_LABELS[task.status ?? "todo"]}
            </Badge>
            <PriorityBadge value={task.priority} />
          </div>
          {(task.expected_minutes != null || task.actual_minutes != null) && (
            <div className="text-muted-foreground mt-0.5 text-xs">
              {task.expected_minutes != null && (
                <span>est {formatMinutes(task.expected_minutes)}</span>
              )}
              {task.actual_minutes != null && (
                <span> · spent {formatMinutes(task.actual_minutes)}</span>
              )}
            </div>
          )}
          {task.description && !editing ? (
            <div className="mt-2">
              <Markdown>{task.description}</Markdown>
            </div>
          ) : null}
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Edit task"
            onClick={() => setEditing((v) => !v)}
          >
            {editing ? <IconX /> : <IconPencil />}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Delete task"
            onClick={() => destroy.mutate({ path: { id: task.id } })}
          >
            <IconTrash />
          </Button>
        </div>
      </div>

      {editing ? (
        <div className="mt-3 flex flex-col gap-2 border-t pt-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <div className="flex gap-2">
            <Input
              type="number"
              min={0}
              value={expected}
              onChange={(e) => setExpected(e.target.value)}
              placeholder="expected min"
            />
            <Input
              type="number"
              min={0}
              value={actual}
              onChange={(e) => setActual(e.target.value)}
              placeholder="actual min"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">Priority</span>
            <PrioritySelect value={priority} onChange={setPriority} />
          </div>
          <MarkdownField
            value={description}
            onChange={setDescription}
            placeholder="Description (markdown)…"
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={saveEdits} disabled={update.isPending}>
              Save
            </Button>
            <Button variant="outline" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            {!isDone && task.status !== "in_progress" ? (
              <Button variant="secondary" onClick={() => setStatus("in_progress")}>
                Start
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
