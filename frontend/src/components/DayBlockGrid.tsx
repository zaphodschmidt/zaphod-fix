import { useMemo } from "react"
import type { Completion, Streak } from "@/api"

interface DayBlockGridProps {
  sizeX: number
  sizeY: number
  streak: Streak
  color: string
}

function DayBlockGrid({ sizeX, sizeY, streak, color }: DayBlockGridProps) {
  function DayBlock({ color }: { color: string }) {
    return <div className={`w-10 h-10 bg-${color}-200 rounded-md`} />
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
    <div className="outline m-2 p-2 rounded-md w-fit">
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
    </div>
  )
}

export default DayBlockGrid