import type { PriorityEnum } from "@/api/types.gen"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PRIORITIES, PRIORITY_ITEMS, PRIORITY_BY_VALUE } from "@/lib/priority"
import { cn } from "@/lib/utils"

/** Dropdown to pick a task's Eisenhower quadrant. */
export function PrioritySelect({
  value,
  onChange,
  className,
}: {
  value: PriorityEnum
  onChange: (value: PriorityEnum) => void
  className?: string
}) {
  return (
    <Select
      items={PRIORITY_ITEMS}
      value={value}
      onValueChange={(v) => onChange(v as PriorityEnum)}
    >
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {PRIORITIES.map((p) => (
            <SelectItem key={p.value} value={p.value}>
              {p.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

/** Small colored badge showing a task's quadrant. */
export function PriorityBadge({
  value,
  className,
}: {
  value?: PriorityEnum | null
  className?: string
}) {
  if (!value) return null
  const meta = PRIORITY_BY_VALUE[value]
  if (!meta) return null
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        meta.className,
        className
      )}
    >
      {meta.badge}
    </span>
  )
}
