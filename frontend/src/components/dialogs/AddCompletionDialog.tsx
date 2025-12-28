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
import { IconCheck, IconCalendar, IconPlus } from "@tabler/icons-react"
import { COLOR_CLASSES } from "@/lib/colors"
import { cn } from "@/lib/utils"

function AddCompletionDialog({ streak }: { streak: Streak }) {
    const queryClient = useQueryClient()
    const [open, setOpen] = useState(false)
    const colorSet = COLOR_CLASSES[streak.color] ?? COLOR_CLASSES.gray

    const { mutate: createCompletion, isPending } = useMutation({
        ...completionsCreateMutation({}),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: completionsListQueryKey({}) })
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
            new Date().toISOString().slice(0, 10)
        const body: CompletionWritable = { date_completed: dateCompleted, streak: streak.id }
        createCompletion({ body })
    }

    // Quick complete for today
    const handleQuickComplete = () => {
        const dateCompleted = new Date().toISOString().slice(0, 10)
        const body: CompletionWritable = { date_completed: dateCompleted, streak: streak.id }
        createCompletion({ body })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <div className="flex items-center gap-2">
                {/* Quick complete button */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleQuickComplete}
                    disabled={isPending}
                    className="h-8 px-3 gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                    <IconCheck className="w-3.5 h-3.5" />
                    Today
                </Button>

                {/* Full dialog trigger */}
                <DialogTrigger render={
                    <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 px-3 gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    >
                        <IconPlus className="w-3.5 h-3.5" />
                        Add Date
                    </Button>
                } />
            </div>

            <DialogContent className="sm:max-w-[380px] bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl">
                <DialogHeader className="pb-2">
                    <div className="flex items-center gap-3 mb-1">
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            colorSet.bright
                        )}>
                            <IconCalendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg">Log Completion</DialogTitle>
                            <DialogDescription className="text-sm">
                                {streak.name}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <FieldGroup>
                        <FieldSet>
                            <Field>
                                <FieldLabel htmlFor="completion-date" className="text-sm font-medium flex items-center gap-2">
                                    <IconCalendar className="w-4 h-4 text-muted-foreground" />
                                    Completion Date
                                </FieldLabel>
                                <Input
                                    id="completion-date"
                                    name="date_completed"
                                    defaultValue={new Date().toISOString().slice(0, 10)}
                                    required
                                    autoFocus
                                    type="date"
                                    className="h-11 bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                                />
                            </Field>
                        </FieldSet>
                    </FieldGroup>

                    <DialogFooter className="gap-2 sm:gap-2">
                        <DialogClose render={
                            <Button 
                                variant="outline" 
                                type="button"
                                className="flex-1 sm:flex-none border-border/50 hover:bg-muted/50"
                            >
                                Cancel
                            </Button>
                        } />
                        <Button 
                            type="submit" 
                            disabled={isPending}
                            className={cn(
                                "flex-1 sm:flex-none gap-2 text-white",
                                colorSet.bright,
                                "hover:opacity-90 transition-opacity"
                            )}
                        >
                            {isPending ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <IconCheck className="w-4 h-4" />
                                    Log Completion
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddCompletionDialog
