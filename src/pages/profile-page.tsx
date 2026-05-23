import { useState } from "react"
import { useLiveQuery } from "dexie-react-hooks"
import { PencilIcon } from "lucide-react"
import { db } from "@/lib/loaffly-db"
import { useTheme } from "@/components/theme-provider"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"

function ProfilePage() {
    // 1. Fetch theme and db profile reactively
    const { theme, setTheme } = useTheme()
    const profile = useLiveQuery(() => db.profile.get("current-user"))

    // 2. States for Dialog and Form
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [editName, setEditName] = useState<string>("")

    // Generate Initials
    const initials = profile?.name
        ? profile.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
        : "LX"

    function openEditDialog() {
        if (profile) {
            setEditName(profile.name)
        }
        setIsOpen(true)
    }

    async function handleSaveName() {
        if (!editName.trim()) {
            alert("Name cannot be empty.")
            return
        }

        await db.profile.put({
            id: "current-user",
            name: editName.trim(),
            username: profile?.username || "lewin",
        })

        setIsOpen(false)
    }

    const isDarkMode = theme === "dark"

    return (
        <div className="flex flex-col gap-8">
            {/* Header Title */}
            <div className="flex h-14 items-center justify-center">
                <h1 className="text-base font-semibold text-foreground">
                    Profile
                </h1>
            </div>

            {/* Profile Overview Card */}
            <div className="flex flex-col items-center gap-4">
                {/* Large themed avatar with absolute positioned edit pencil badge */}
                <div className="relative">
                    <div className="flex size-28 items-center justify-center rounded-full bg-cool-mist text-3xl font-extrabold text-primary shadow-sm">
                        {initials}
                    </div>
                    <button
                        onClick={openEditDialog}
                        className="absolute right-0 bottom-0 flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform duration-200 hover:scale-105 active:scale-95"
                        aria-label="Edit Profile Name"
                    >
                        <PencilIcon className="size-4" />
                    </button>
                </div>

                {/* Profile Name */}
                <div className="flex flex-col items-center gap-0.5">
                    <h2 className="text-xl font-bold text-foreground">
                        {profile?.name || "Lewin Xander"}
                    </h2>
                </div>
            </div>

            {/* Preference Lists Section */}
            <div className="flex flex-col gap-4 rounded-xl border border-border/10 bg-secondary/30 p-5">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-foreground">
                            Appearance
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {isDarkMode ? "Dark Mode" : "Light Mode"}
                        </span>
                    </div>

                    {/* Smooth sliding toggle switch */}
                    <button
                        onClick={() => setTheme(isDarkMode ? "light" : "dark")}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                            isDarkMode ? "bg-warm-ochre" : "bg-muted"
                        }`}
                        aria-label="Toggle theme mode"
                    >
                        <span
                            className={`pointer-events-none inline-block size-5 transform rounded-full bg-background shadow-md ring-0 transition duration-200 ${
                                isDarkMode ? "translate-x-5" : "translate-x-0"
                            }`}
                        />
                    </button>
                </div>
            </div>

            {/* Edit Name Shadcn Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-foreground">
                            Edit Profile
                        </DialogTitle>
                    </DialogHeader>

                    {/* Name Input */}
                    <div className="my-4">
                        <Field>
                            <FieldLabel>Name</FieldLabel>
                            <Input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                placeholder="Enter your name"
                                autoFocus
                            />
                        </Field>
                    </div>

                    {/* Footer Cancel / Done Controls */}
                    <DialogFooter className="flex flex-row justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSaveName}>Done</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export { ProfilePage }
