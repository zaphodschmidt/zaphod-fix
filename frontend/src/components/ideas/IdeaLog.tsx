import * as React from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { IconTrash } from "@tabler/icons-react"

import {
  ideasCreateMutation,
  ideasDestroyMutation,
  ideasListOptions,
  ideasPartialUpdateMutation,
} from "@/api/@tanstack/react-query.gen"
import type { Idea } from "@/api/types.gen"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { dateTimeOnDayISO, formatTime, localDayOf, todayISO } from "@/lib/format"

function invalidateIdeas(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ideasListOptions().queryKey })
}

/** Capture an idea — the source/context is required so you know where it came from. */
export function IdeaInput({ day }: { day?: string }) {
  const queryClient = useQueryClient()
  const [content, setContent] = React.useState("")
  const [source, setSource] = React.useState("")

  const create = useMutation({
    ...ideasCreateMutation(),
    onSuccess: () => {
      invalidateIdeas(queryClient)
      setContent("")
      setSource("")
    },
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !source.trim()) return
    const backfill = day && day !== todayISO()
    create.mutate({
      body: {
        content: content.trim(),
        source: source.trim(),
        ...(backfill ? { created_at: dateTimeOnDayISO(day) } : {}),
      },
    })
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's the idea?"
        rows={2}
      />
      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Source — where did you hear it / what were you doing? (required)"
          className="min-w-48 flex-1"
        />
        <Button
          type="submit"
          disabled={!content.trim() || !source.trim() || create.isPending}
        >
          Add idea
        </Button>
      </div>
    </form>
  )
}

function IdeaRow({ idea }: { idea: Idea }) {
  const queryClient = useQueryClient()
  const [editing, setEditing] = React.useState(false)
  const [content, setContent] = React.useState(idea.content)
  const [source, setSource] = React.useState(idea.source)

  const update = useMutation({
    ...ideasPartialUpdateMutation(),
    onSuccess: () => invalidateIdeas(queryClient),
  })
  const destroy = useMutation({
    ...ideasDestroyMutation(),
    onSuccess: () => invalidateIdeas(queryClient),
  })

  const save = () => {
    const c = content.trim()
    const s = source.trim()
    if (c && s && (c !== idea.content || s !== idea.source)) {
      update.mutate({ path: { id: idea.id }, body: { content: c, source: s } })
    }
    setEditing(false)
  }

  return (
    <tr className="border-border/60 border-b align-top last:border-0">
      <td className="text-muted-foreground px-3 py-2 align-top tabular-nums whitespace-nowrap">
        {formatTime(idea.created_at)}
      </td>
      {editing ? (
        <td className="px-3 py-2" colSpan={2}>
          <div className="flex flex-col gap-2">
            <Textarea
              autoFocus
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={2}
              placeholder="Idea"
            />
            <Input
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Source"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={save}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </td>
      ) : (
        <>
          <td className="px-3 py-2">
            <span
              className="block cursor-text whitespace-pre-wrap"
              onClick={() => {
                setContent(idea.content)
                setSource(idea.source)
                setEditing(true)
              }}
            >
              {idea.content}
            </span>
          </td>
          <td className="text-muted-foreground px-3 py-2 align-top">
            {idea.source}
          </td>
        </>
      )}
      <td className="px-2 py-2 align-top">
        <button
          type="button"
          aria-label="Delete idea"
          className="text-muted-foreground hover:text-destructive opacity-0 transition-opacity group-hover/idea:opacity-100"
          onClick={() => destroy.mutate({ path: { id: idea.id } })}
        >
          <IconTrash className="size-4" />
        </button>
      </td>
    </tr>
  )
}

/** A `time | Idea | Source` table for the given (already-ordered) ideas. */
export function IdeaTable({ ideas }: { ideas: Idea[] }) {
  if (ideas.length === 0) {
    return <p className="text-muted-foreground text-sm">No ideas yet.</p>
  }
  return (
    <div className="group/idea overflow-hidden rounded-xl border">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted-foreground border-border/60 border-b text-left">
            <th className="w-16 px-3 py-2 font-medium">time</th>
            <th className="px-3 py-2 font-medium">Idea</th>
            <th className="px-3 py-2 font-medium">Source</th>
            <th className="w-8" />
          </tr>
        </thead>
        <tbody>
          {ideas.map((idea) => (
            <IdeaRow key={idea.id} idea={idea} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Quick-add box + a table of one day's ideas (oldest first). */
export function IdeaLog({ day }: { day?: string }) {
  const { data: ideas } = useQuery(ideasListOptions())
  const rows = (ideas ?? []).filter((i) =>
    day ? localDayOf(i.created_at) === day : true
  )
  const ordered = [...rows].reverse()

  return (
    <div className="flex flex-col gap-3">
      <IdeaInput day={day} />
      <IdeaTable ideas={ordered} />
    </div>
  )
}
