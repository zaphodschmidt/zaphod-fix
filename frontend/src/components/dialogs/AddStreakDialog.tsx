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
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import {
    streaksCreateMutation,
    streaksListQueryKey,
} from "@/api/@tanstack/react-query.gen"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { BG_200_BY_COLOR } from "@/lib/colors"
import type { ColorEnum, StreakWritable } from "@/api/types.gen"

function AddStreakDialog() {
    const queryClient = useQueryClient()

    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [color, setColor] = useState<ColorEnum | "">("")
    const colors = Object.keys(BG_200_BY_COLOR) as ColorEnum[]

    const { mutate: createStreak, isPending } = useMutation({
        ...streaksCreateMutation({}),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: streaksListQueryKey({}) })
            setName("")
            setColor("")
            setOpen(false)
        },
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!name.trim() || !color) return
        const startDate = new Date().toISOString().slice(0, 10) // DRF DateField expects YYYY-MM-DD
        const body: StreakWritable = { name: name.trim(), color, start_date: startDate }
        createStreak({ body })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button variant="outline" />}>
                Add New Streak
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Streak</DialogTitle>
                    <DialogDescription>
                        Create a new streak to track your progress.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-6">
                    <FieldGroup>
                        <FieldSet>
                            <Field>
                                <FieldLabel htmlFor="streak-name">Streak Name</FieldLabel>
                                <Input
                                    id="streak-name"
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Daily run"
                                    required
                                    autoFocus
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="streak-color">Streak Color</FieldLabel>
                                <Select value={color} onValueChange={(v) => setColor(v as ColorEnum)}>
                                    <SelectTrigger id="streak-color" className="w-full">
                                        <SelectValue className={!color ? "text-muted-foreground" : undefined}>
                                            {!color ? "Select a color" : null}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Colors</SelectLabel>
                                            {colors.map((c) => (
                                                <SelectItem key={c} value={c}>
                                                    {c}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FieldDescription>
                                    This is used to color the streak blocks.
                                </FieldDescription>
                            </Field>
                        </FieldSet>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose render={<Button variant="outline" type="button" />}>
                            Cancel
                        </DialogClose>
                        <Button type="submit" disabled={isPending || !name.trim() || !color}>
                            {isPending ? "Creating..." : "Create Streak"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddStreakDialog