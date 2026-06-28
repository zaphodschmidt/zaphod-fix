import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IconTrash } from "@tabler/icons-react"

import {
  tasksDestroyMutation,
  tasksListOptions,
  tasksPartialUpdateMutation,
} from "@/api/@tanstack/react-query.gen"
import type { Task } from "@/api/types.gen"
import { PriorityBadge } from "@/components/tasks/PrioritySelect"
import { formatMinutes } from "@/lib/format"

/** Compact checkbox todo row: "[ ] title – 30m", with a priority badge. */
export function TaskRow({ task }: { task: Task }) {
  const queryClient = useQueryClient()
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: tasksListOptions().queryKey })
  const update = useMutation({
    ...tasksPartialUpdateMutation(),
    onSuccess: invalidate,
  })
  const destroy = useMutation({
    ...tasksDestroyMutation(),
    onSuccess: invalidate,
  })

  const done = task.status === "done"

  return (
    <div className="group flex items-center gap-2 py-1">
      <input
        type="checkbox"
        checked={done}
        aria-label={done ? "Mark not done" : "Mark done"}
        className="accent-primary size-4"
        onChange={() =>
          update.mutate({
            path: { id: task.id },
            body: {
              status: done ? "todo" : "done",
              completed_at: done ? null : new Date().toISOString(),
            },
          })
        }
      />
      <span className={done ? "text-muted-foreground line-through" : ""}>
        {task.title}
        {task.expected_minutes != null ? (
          <span className="text-muted-foreground">
            {" "}
            – {formatMinutes(task.expected_minutes)}
          </span>
        ) : null}
      </span>
      <PriorityBadge value={task.priority} className="ml-auto" />
      <button
        type="button"
        aria-label="Delete todo"
        className="text-muted-foreground hover:text-destructive opacity-0 transition-opacity group-hover:opacity-100"
        onClick={() => destroy.mutate({ path: { id: task.id } })}
      >
        <IconTrash className="size-4" />
      </button>
    </div>
  )
}
