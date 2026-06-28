import * as React from "react"

import { Markdown } from "@/components/Markdown"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type MarkdownFieldProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  rows?: number
  id?: string
}

/** A textarea with an Edit / Preview toggle for writing long markdown text. */
export function MarkdownField({
  value,
  onChange,
  placeholder,
  className,
  rows = 6,
  id,
}: MarkdownFieldProps) {
  const [tab, setTab] = React.useState<"edit" | "preview">("edit")

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex gap-1">
        <Button
          type="button"
          size="xs"
          variant={tab === "edit" ? "secondary" : "ghost"}
          onClick={() => setTab("edit")}
        >
          Edit
        </Button>
        <Button
          type="button"
          size="xs"
          variant={tab === "preview" ? "secondary" : "ghost"}
          onClick={() => setTab("preview")}
        >
          Preview
        </Button>
      </div>
      {tab === "edit" ? (
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
        />
      ) : (
        <div className="border-input bg-input/30 min-h-16 rounded-xl border px-3 py-3">
          {value.trim() ? (
            <Markdown>{value}</Markdown>
          ) : (
            <p className="text-muted-foreground text-sm">
              Nothing to preview yet.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
