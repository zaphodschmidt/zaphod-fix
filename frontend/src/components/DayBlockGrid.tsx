import { useMemo } from "react"
import type { Streak } from "@/api"

interface DayBlockGridProps {
  sizeX: number
  sizeY: number
  streak: Streak
}

function DayBlockGrid({ sizeX, sizeY, streak }: DayBlockGridProps) {
  function DayBlock(): React.ReactNode {
    return (
      <div className="w-10 h-10 bg-gray-200 rounded-md" />
    )
  }

  const dayBlocks = useMemo(() => {
    const dayBlocks: React.ReactNode[][] = Array.from({ length: sizeX }, (_, i) => Array.from({ length: sizeY }, (_, j) => <DayBlock key={`${i}-${j}`} />))
    return dayBlocks
  }, [sizeX, sizeY])

  return (
    <div className="outline m-2 p-2 rounded-md w-fit">
      <h3>{streak?.name}</h3>
    <div className="outline m-2 p-2 rounded-md w-fit">
      <div className={`grid grid-cols-${sizeX} grid-rows-${sizeY} gap-1`}>
        {dayBlocks.map((row, i) => (
          <div key={i} className="flex flex-row gap-2">
            {row.map((block, j) => (
              <div key={j}>{block}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
    </div>
  )
}

export default DayBlockGrid