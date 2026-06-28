import * as React from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  checkinRetrieveOptions,
  dailyAnswersCreateMutation,
  dailyAnswersPartialUpdateMutation,
} from "@/api/@tanstack/react-query.gen"
import type { CheckinItem } from "@/api/types.gen"
import { Textarea } from "@/components/ui/textarea"

function ReflectionRow({
  item,
  date,
  onSaved,
}: {
  item: CheckinItem
  date: string
  onSaved: () => void
}) {
  const [answer, setAnswer] = React.useState(item.answer)

  const create = useMutation({
    ...dailyAnswersCreateMutation(),
    onSuccess: onSaved,
  })
  const update = useMutation({
    ...dailyAnswersPartialUpdateMutation(),
    onSuccess: onSaved,
  })

  // Save on blur — only when the text actually changed.
  const save = () => {
    if (answer === item.answer) return
    if (item.answer_id) {
      update.mutate({ path: { id: item.answer_id }, body: { answer } })
    } else {
      create.mutate({ body: { question: item.question_id, date, answer } })
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold">{item.text}</span>
      <Textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onBlur={save}
        rows={2}
        placeholder="…"
      />
    </div>
  )
}

/** The daily reflections: each active question with its answer for `date`, saved on blur. */
export function CheckinSection({ date }: { date: string }) {
  const queryClient = useQueryClient()
  const options = checkinRetrieveOptions({ query: { date } })
  const { data, isLoading } = useQuery(options)

  const onSaved = () =>
    queryClient.invalidateQueries({ queryKey: options.queryKey })

  if (isLoading) {
    return <p className="text-muted-foreground text-sm">Loading…</p>
  }
  if (!data || data.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No active questions yet. Add some on the Questions page.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {data.map((item) => (
        <ReflectionRow
          key={item.question_id}
          item={item}
          date={date}
          onSaved={onSaved}
        />
      ))}
    </div>
  )
}
