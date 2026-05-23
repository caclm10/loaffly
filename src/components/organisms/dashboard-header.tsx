import { CalendarIcon, ChevronDownIcon } from "lucide-react"

interface DashboardHeaderProps {
    profileName: string | undefined
}

function DashboardHeader({ profileName }: DashboardHeaderProps) {
    // Get initials for profile picture placeholder
    const initials = profileName
        ? profileName
              .split(" ")
              .map((n) => n[0])
              .join("")
        : "?"

    return (
        <div className="flex items-center justify-between">
            {/* Profile / Greeting */}
            <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cool-mist text-lg font-semibold text-primary">
                    {initials}
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                        Good Morning
                    </span>
                    <h2 className="text-base leading-tight font-semibold text-foreground">
                        {profileName}
                    </h2>
                </div>
            </div>

            {/* Date Selector */}
            <button className="flex items-center gap-2 rounded-xl bg-secondary/50 px-3 py-2 text-sm font-medium text-warm-ochre transition-colors hover:bg-secondary">
                <CalendarIcon className="h-4 w-4" />
                <span>May</span>
                <ChevronDownIcon className="h-3 w-3 opacity-60" />
            </button>
        </div>
    )
}

export { DashboardHeader }
