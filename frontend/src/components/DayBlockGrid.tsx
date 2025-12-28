import { useMemo } from "react"
import { cn } from "@/lib/utils"
import type { Completion, Streak } from "@/api"
import { COLOR_CLASSES, EMPTY_BLOCK_CLASS } from "@/lib/colors"
import AddCompletionDialog from "./dialogs/AddCompletionDialog"
import { IconFlame, IconCalendarStats } from "@tabler/icons-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface DayBlockGridProps {
  sizeX: number
  sizeY: number
  streak: Streak
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function DayBlockGrid({ sizeX, sizeY, streak }: DayBlockGridProps) {
  const colorSet = COLOR_CLASSES[streak.color] ?? COLOR_CLASSES.gray

  // Day block with tooltip
  function DayBlock({ 
    isCompleted, 
    date 
  }: { 
    isCompleted: boolean
    date?: string
  }) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <div
            className={cn(
              "h-3 w-3 rounded-sm transition-all duration-200 cursor-pointer",
              "hover:scale-125 hover:z-10 hover:ring-2 hover:ring-white/20",
              isCompleted ? colorSet.bright : EMPTY_BLOCK_CLASS,
            )}
          />
        </TooltipTrigger>
        <TooltipContent>
          {date ? `${date}${isCompleted ? " ✓" : ""}` : undefined}
        </TooltipContent>
      </Tooltip>
    )
  }

  // Build the grid blocks - stats come from backend
  const dayBlocks = useMemo(() => {
    // Build a Set of completed date strings for quick lookup
    const completedDates = new Set(
      streak.completions.map((c: Completion) => c.date_completed)
    )

    // Generate dates for the grid (going back from today)
    const today = new Date()
    const totalDays = sizeX * sizeY
    const blocks: React.ReactNode[] = []

    // Start from the beginning of the grid
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - totalDays + 1)

    for (let col = 0; col < sizeX; col++) {
      for (let row = 0; row < sizeY; row++) {
        const currentDate = new Date(startDate)
        currentDate.setDate(startDate.getDate() + col * sizeY + row)
        const dateStr = currentDate.toISOString().slice(0, 10)
        const isCompleted = completedDates.has(dateStr)

        blocks.push(
          <DayBlock 
            key={`${col}-${row}`} 
            isCompleted={isCompleted}
            date={dateStr}
          />
        )
      }
    }
    return blocks
  }, [sizeX, sizeY, streak, colorSet])

  return (
    <div className="group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-5 transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-3 h-3 rounded-full",
            colorSet.bright
          )} />
          <h3 className="font-semibold text-lg text-foreground tracking-tight">
            {streak.name}
          </h3>
        </div>
        
        {/* Quick stats - values from backend */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <IconFlame className="w-4 h-4 text-orange-500" />
            <span className="font-medium">{streak.current_streak}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <IconCalendarStats className="w-4 h-4 text-primary" />
            <span className="font-medium">{streak.days_completed}</span>
          </div>
        </div>
      </div>

      {/* Grid with weekday labels */}
      <div className="flex gap-2">
        {/* Weekday labels */}
        <div 
          className="flex flex-col justify-between text-[10px] text-muted-foreground font-medium pr-1"
          style={{ height: `${sizeY * 16}px` }}
        >
          {WEEKDAYS.map((day, i) => (
            <span key={i} className="leading-3">{day}</span>
          ))}
        </div>

        {/* The grid */}
        <div
          className="grid grid-flow-col gap-1"
          style={{
            gridTemplateColumns: `repeat(${sizeX}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${sizeY}, minmax(0, 1fr))`,
          }}
        >
          {dayBlocks}
        </div>
      </div>

      {/* Footer with legend and action */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30">
        {/* Legend */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-0.5">
            <div className={cn("w-3 h-3 rounded-sm", EMPTY_BLOCK_CLASS)} />
            <div className={cn("w-3 h-3 rounded-sm", colorSet.light)} />
            <div className={cn("w-3 h-3 rounded-sm", colorSet.medium)} />
            <div className={cn("w-3 h-3 rounded-sm", colorSet.bright)} />
          </div>
          <span>More</span>
        </div>

        <AddCompletionDialog streak={streak} />
      </div>
    </div>
  )
}

export default DayBlockGrid