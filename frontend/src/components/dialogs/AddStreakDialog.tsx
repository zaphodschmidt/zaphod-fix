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
    streaksMyStreaksListQueryKey,
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
import { COLOR_CLASSES, COLOR_DISPLAY_NAMES } from "@/lib/colors"
import type { ColorEnum, StreakWritable } from "@/api/types.gen"
import { IconPlus, IconFlame, IconPalette, IconCalendarEventFilled, IconNotebook } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Textarea } from "../ui/textarea"
import { useAuth } from "@/contexts/AuthContext"

function AddStreakDialog() {
    const queryClient = useQueryClient()

    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [color, setColor] = useState<ColorEnum | "">("")
    const colors = Object.keys(COLOR_CLASSES).filter(c => COLOR_DISPLAY_NAMES[c]) as ColorEnum[]
    const [description, setDescription] = useState("")
    const { user } = useAuth()
    const { mutate: createStreak, isPending } = useMutation({
        ...streaksCreateMutation({}),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ 
                queryKey: streaksMyStreaksListQueryKey({}) })
            setName("")
            setColor("")
            setDescription("")
            setOpen(false)
        },
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!name.trim() || !color || !user?.id) return
        const startDate = new Date().toISOString().slice(0, 10)
        const body: StreakWritable = { name: name.trim(), color, start_date: startDate, description: description.trim(), user: user?.id }
        createStreak({ body })
    }

    const colorSet = color ? COLOR_CLASSES[color] : null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={
                <Button className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg shadow-primary/25">
                    <IconPlus className="w-4 h-4" />
                    <span>New Streak</span>
                </Button>
            } />

            <DialogContent className="sm:max-w-[440px] bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl">
                <DialogHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <IconFlame className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">Create New Streak</DialogTitle>
                            <DialogDescription className="text-sm">
                                Start tracking a new habit today
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <FieldGroup>
                        <FieldSet className="space-y-4">
                            <Field>
                                <FieldLabel htmlFor="streak-name" className="text-sm font-medium flex items-center gap-2">
                                    <IconCalendarEventFilled className="w-4 h-4 text-muted-foreground" />
                                    Streak Name
                                </FieldLabel>
                                <Input
                                    id="streak-name"
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Morning workout, Read 30 mins..."
                                    required
                                    autoFocus
                                    className="h-11 bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="streak-color" className="text-sm font-medium flex items-center gap-2">
                                    <IconPalette className="w-4 h-4 text-muted-foreground" />
                                    Theme Color
                                </FieldLabel>
                                <Select value={color} onValueChange={(v) => setColor(v as ColorEnum)}>
                                    <SelectTrigger 
                                        id="streak-color" 
                                        className="h-11 w-full bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                                    >
                                        <SelectValue>
                                            {color ? (
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-4 h-4 rounded-full",
                                                        COLOR_CLASSES[color]?.bright
                                                    )} />
                                                    <span>{COLOR_DISPLAY_NAMES[color]}</span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">Choose a color...</span>
                                            )}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover/95 backdrop-blur-xl border-border/50">
                                        <SelectGroup>
                                            <SelectLabel className="text-muted-foreground">Colors</SelectLabel>
                                            {colors.map((c) => (
                                                <SelectItem key={c} value={c} className="cursor-pointer">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "w-4 h-4 rounded-full",
                                                            COLOR_CLASSES[c]?.bright
                                                        )} />
                                                        <span>{COLOR_DISPLAY_NAMES[c]}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FieldDescription className="text-xs text-muted-foreground mt-1.5">
                                    This will be the color of your streak blocks
                                </FieldDescription>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="streak-description" className="text-sm font-medium flex items-center gap-2">
                                    <IconNotebook className="w-4 h-4 text-muted-foreground" />
                                    Description
                                </FieldLabel>
                                <Textarea
                                    id="streak-description"
                                    name="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="e.g., I want to start a new habit of reading 30 minutes every day"
                                    className="h-24 bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                                />
                                <FieldDescription className="text-xs text-muted-foreground mt-1.5">
                                    This will be the description of your streak
                                </FieldDescription>
                            </Field>
                        </FieldSet>
                    </FieldGroup>

                    {/* Preview */}
                    {color && (
                        <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
                            <p className="text-xs text-muted-foreground mb-3">Preview</p>
                            <div className="flex items-center gap-3">
                                <div className={cn("w-4 h-4 rounded-full", colorSet?.bright)} />
                                <span className="font-medium">{name || "Your streak"}</span>
                            </div>
                            <div className="flex gap-1 mt-3">
                                {[...Array(7)].map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={cn(
                                            "w-6 h-6 rounded",
                                            i < 4 ? colorSet?.bright : "bg-muted/40"
                                        )} 
                                    />
                                ))}
                            </div>
                        </div>
                    )}

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
                            disabled={isPending || !name.trim() || !color}
                            className="flex-1 sm:flex-none bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity gap-2"
                        >
                            {isPending ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <IconFlame className="w-4 h-4" />
                                    Create Streak
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddStreakDialog
