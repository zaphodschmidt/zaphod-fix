import type { PriorityEnum } from "@/api/types.gen"

export type PriorityMeta = {
  value: PriorityEnum
  label: string
  badge: string
  className: string
}

/** The four Eisenhower-matrix quadrants, in priority order. */
export const PRIORITIES: PriorityMeta[] = [
  {
    value: "urgent_important",
    label: "Urgent & Important",
    badge: "Urgent · Important",
    className: "bg-destructive/15 text-destructive",
  },
  {
    value: "urgent_not_important",
    label: "Urgent, Not Important",
    badge: "Urgent · Not imp.",
    className: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  },
  {
    value: "not_urgent_important",
    label: "Not Urgent, Important",
    badge: "Important · Not urgent",
    className: "bg-primary/15 text-primary",
  },
  {
    value: "not_urgent_not_important",
    label: "Not Urgent, Not Important",
    badge: "Not urgent · Not imp.",
    className: "bg-muted text-muted-foreground",
  },
]

export const PRIORITY_ITEMS = PRIORITIES.map((p) => ({
  value: p.value,
  label: p.label,
}))

export const PRIORITY_BY_VALUE = PRIORITIES.reduce(
  (acc, p) => {
    acc[p.value] = p
    return acc
  },
  {} as Record<PriorityEnum, PriorityMeta>
)

export const DEFAULT_PRIORITY: PriorityEnum = "urgent_important"
