import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export function ChartCard({
  title,
  description,
  children,
  className,
}: {
  title: string
  description?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-5 transition-all duration-300 hover:border-border',
        className
      )}
    >
      <div className="mb-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  )
}

