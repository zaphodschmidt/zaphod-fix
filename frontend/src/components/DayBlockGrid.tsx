import { useMemo } from "react"
import { cn } from "@/lib/utils"
import type { Completion, Streak } from "@/api"
import { BG_200_BY_COLOR } from "@/lib/colors"
import AddCompletionDialog from "./dialogs/AddCompletionDialog"

interface DayBlockGridProps {
  sizeX: number
  sizeY: number
  streak: Streak
  color: string
}

function DayBlockGrid({ sizeX, sizeY, streak, color }: DayBlockGridProps) {
  function DayBlock({ color }: { color: string }) {
    const bgClass = BG_200_BY_COLOR[color] ?? BG_200_BY_COLOR.gray
    return <div className={cn("h-10 w-10 rounded-md", bgClass)} />
  }

  const dayBlocks = useMemo<React.ReactNode[]>(() => {
    const sortedDays: Completion[] = [...streak.completions].sort(
      (a: Completion, b: Completion) =>
        new Date(a.date_completed).getTime() - new Date(b.date_completed).getTime(),
    )

    const blocks: React.ReactNode[] = []
    for (let i = 0; i < sizeX; i++) {
      for (let j = 0; j < sizeY; j++) {
        const next = sortedDays[0]
        if (next && j === next.day_of_week) {
          sortedDays.shift()
          blocks.push(<DayBlock key={`${i}-${j}`} color={color} />)
        } else {
          blocks.push(<DayBlock key={`${i}-${j}`} color="gray" />)
        }
      }
    }
    return blocks
  }, [sizeX, sizeY, streak, color])

  return (
    <div className="outline m-2 p-2 rounded-md w-fit">
      <h3>{streak?.name}</h3>
      <div
        className="grid grid-flow-col gap-1"
        style={{
          gridTemplateColumns: `repeat(${sizeX}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${sizeY}, minmax(0, 1fr))`,
        }}
      >
        {dayBlocks}
      </div>
      <AddCompletionDialog streak={streak} />
    </div>
  )
}

export default DayBlockGrid