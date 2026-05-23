import { cn } from "@/lib/utils"

interface NumpadProps {
    onInput: (value: string) => void
    onDelete: () => void
    onSubmit: () => void
}

interface NumpadKey {
    label: string
    value: string
    type: "number" | "action" | "submit"
    icon?: React.ReactNode
}

const KEYS: NumpadKey[] = [
    { label: "1", value: "1", type: "number" },
    { label: "2", value: "2", type: "number" },
    { label: "3", value: "3", type: "number" },
    { label: "−", value: "-", type: "action" },
    { label: "4", value: "4", type: "number" },
    { label: "5", value: "5", type: "number" },
    { label: "6", value: "6", type: "number" },
    { label: "⎵", value: " ", type: "action" },
    { label: "7", value: "7", type: "number" },
    { label: "8", value: "8", type: "number" },
    { label: "9", value: "9", type: "number" },
    { label: "⌫", value: "delete", type: "action" },
    { label: ",", value: ",", type: "number" },
    { label: "0", value: "0", type: "number" },
    { label: ".", value: ".", type: "number" },
    { label: "✓", value: "submit", type: "submit" },
]

function Numpad({ onInput, onDelete, onSubmit }: NumpadProps) {
    function handlePress(key: NumpadKey) {
        if (key.value === "delete") {
            onDelete()
        } else if (key.value === "submit") {
            onSubmit()
        } else {
            onInput(key.value)
        }
    }

    return (
        <div className="grid grid-cols-4 gap-2">
            {KEYS.map((key) => (
                <button
                    key={key.label + key.value}
                    type="button"
                    onClick={() => handlePress(key)}
                    className={cn(
                        "flex h-14 items-center justify-center rounded-xl text-2xl font-medium transition-colors active:scale-95",
                        key.type === "number" &&
                            "border border-border/50 bg-background text-foreground",
                        key.type === "action" && "bg-muted text-foreground",
                        key.type === "submit" &&
                            "bg-primary text-primary-foreground"
                    )}
                >
                    {key.label}
                </button>
            ))}
        </div>
    )
}

export { Numpad }
