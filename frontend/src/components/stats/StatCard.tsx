import type { ComponentType } from 'react'
import { cn } from '@/lib/utils'

type IconProps = {
  className?: string
  stroke?: number
}

export function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: ComponentType<IconProps>
  label: string
  value: string | number
  subtext?: string
  color: string
}) {
  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-5 transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
        </div>
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', color)}>
          <Icon className="w-6 h-6 text-white" stroke={2} />
        </div>
      </div>
    </div>
  )
}


