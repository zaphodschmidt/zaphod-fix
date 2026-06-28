import { createFileRoute, redirect } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as React from 'react'
import { IconTrash } from '@tabler/icons-react'

import {
  questionsCreateMutation,
  questionsDestroyMutation,
  questionsListOptions,
  questionsPartialUpdateMutation,
} from '@/api/@tanstack/react-query.gen'
import type { Question } from '@/api/types.gen'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/questions')({
  beforeLoad: ({ location }) => {
    const token = sessionStorage.getItem('auth_token')
    if (!token) {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }
  },
  component: QuestionsPage,
})

function QuestionRow({ q }: { q: Question }) {
  const queryClient = useQueryClient()
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: questionsListOptions().queryKey })
  const update = useMutation({
    ...questionsPartialUpdateMutation(),
    onSuccess: invalidate,
  })
  const destroy = useMutation({
    ...questionsDestroyMutation(),
    onSuccess: invalidate,
  })

  return (
    <div className="flex items-center gap-2 rounded-xl border p-2">
      <Button
        size="sm"
        variant={q.is_active ? 'default' : 'outline'}
        onClick={() =>
          update.mutate({
            path: { id: q.id },
            body: { is_active: !q.is_active },
          })
        }
      >
        {q.is_active ? 'Active' : 'Inactive'}
      </Button>
      <span className="flex-1">{q.text}</span>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Delete question"
        onClick={() => destroy.mutate({ path: { id: q.id } })}
      >
        <IconTrash />
      </Button>
    </div>
  )
}

function QuestionsPage() {
  const queryClient = useQueryClient()
  const { data: questions } = useQuery(questionsListOptions())
  const [text, setText] = React.useState('')

  const create = useMutation({
    ...questionsCreateMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionsListOptions().queryKey })
      setText('')
    },
  })

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold">Daily questions</h1>
          <p className="text-muted-foreground text-sm">
            Prompts you answer each day in the check-in.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add a question</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                if (text.trim()) {
                  create.mutate({
                    body: { text: text.trim(), order: (questions ?? []).length },
                  })
                }
              }}
            >
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. What did you enjoy most today?"
                className="flex-1"
              />
              <Button type="submit" disabled={!text.trim() || create.isPending}>
                Add
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-2">
          {(questions ?? []).map((q) => (
            <QuestionRow key={q.id} q={q} />
          ))}
        </div>
      </div>
    </div>
  )
}
