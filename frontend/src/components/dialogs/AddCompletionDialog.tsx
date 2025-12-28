import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import {
    completionsCreateMutation,
    completionsListQueryKey,
    streaksListQueryKey,
    streaksRetrieveQueryKey,
} from "@/api/@tanstack/react-query.gen"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import type { Streak, CompletionWritable } from "@/api/types.gen"

function AddCompletionDialog({ streak }: { streak: Streak }) {
    const queryClient = useQueryClient()
    const [open, setOpen] = useState(false)

    const { mutate: createCompletion, isPending } = useMutation({
        ...completionsCreateMutation({}),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: completionsListQueryKey({}) })
            // DayBlockGrid renders from `streak.completions` coming from the streaks query cache,
            // so we need to invalidate streaks as well to see the new completion.
            await queryClient.invalidateQueries({ queryKey: streaksListQueryKey({}) })
            await queryClient.invalidateQueries({
                queryKey: streaksRetrieveQueryKey({ path: { id: streak.id } }),
            })
            setOpen(false)
        },
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const dateCompleted =
            new FormData(e.currentTarget).get("date_completed")?.toString() ??
            new Date().toISOString().slice(0, 10) // DRF DateField expects YYYY-MM-DD
        const body: CompletionWritable = { date_completed: dateCompleted, streak: streak.id }
        createCompletion({ body })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button variant="outline" />}>
                Add New Completion
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Completion</DialogTitle>
                    <DialogDescription>
                        Create a new completion to track your progress.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-6">
                    <FieldGroup>
                        <FieldSet>
                            <Field>
                                <FieldLabel htmlFor="completion-date">Completion Date</FieldLabel>
                                <Input
                                    id="completion-date"
                                    name="date_completed"
                                    defaultValue={new Date().toISOString().slice(0, 10)}
                                    required
                                    autoFocus
                                    type="date"
                                />
                            </Field>
                        </FieldSet>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose render={<Button variant="outline" type="button" />}>
                            Cancel
                        </DialogClose>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Creating..." : "Add Completion"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddCompletionDialog