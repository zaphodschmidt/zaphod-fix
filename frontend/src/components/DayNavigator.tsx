import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addDays, todayISO } from "@/lib/format"

/** Prev/next/date controls for moving between days. */
export function DayNavigator({
  date,
  onChange,
}: {
  date: string
  onChange: (date: string) => void
}) {
  const isToday = date === todayISO()
  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="outline"
        size="icon-sm"
        aria-label="Previous day"
        onClick={() => onChange(addDays(date, -1))}
      >
        <IconChevronLeft />
      </Button>
      <Input
        type="date"
        value={date}
        onChange={(e) => e.target.value && onChange(e.target.value)}
        className="w-auto"
        aria-label="Select day"
      />
      <Button
        variant="outline"
        size="icon-sm"
        aria-label="Next day"
        disabled={isToday}
        onClick={() => onChange(addDays(date, 1))}
      >
        <IconChevronRight />
      </Button>
      {!isToday ? (
        <Button variant="ghost" size="sm" onClick={() => onChange(todayISO())}>
          Today
        </Button>
      ) : null}
    </div>
  )
}
