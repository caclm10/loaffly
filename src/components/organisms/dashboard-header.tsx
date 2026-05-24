import * as React from "react"
import { CalendarIcon, ChevronDownIcon } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { MonthPicker } from "@/components/ui/monthpicker"

interface DashboardHeaderProps {
    profileName: string | undefined
    selectedMonth: Date
    onMonthSelect: (date: Date) => void
}

function DashboardHeader({ profileName, selectedMonth, onMonthSelect }: DashboardHeaderProps) {
    // Get initials for profile picture placeholder
    const initials = profileName
        ? profileName
              .split(" ")
              .map((n) => n[0])
              .join("")
        : "?"

    // Get dynamic greeting based on system hour
    const getGreeting = (): string => {
        const hour = new Date().getHours()
        if (hour >= 5 && hour < 12) return "Good Morning"
        if (hour >= 12 && hour < 17) return "Good Afternoon"
        if (hour >= 17 && hour < 22) return "Good Evening"
        return "Good Night"
    }

    // Format selectedMonth into readable short month (e.g., "May")
    const monthLabel = selectedMonth.toLocaleString("en-US", { month: "short" })

    return (
        <div className="flex items-center justify-between">
            {/* Profile / Greeting */}
            <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cool-mist text-lg font-semibold text-primary">
                    {initials}
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                        {getGreeting()}
                    </span>
                    <h2 className="text-base leading-tight font-semibold text-foreground">
                        {profileName}
                    </h2>
                </div>
            </div>

            {/* Date Selector Popover with MonthPicker */}
            <Popover>
                <PopoverTrigger asChild>
                    <button className="flex items-center gap-2 rounded-xl bg-secondary/50 px-3 py-2 text-sm font-medium text-warm-ochre transition-colors hover:bg-secondary cursor-pointer">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{monthLabel}</span>
                        <ChevronDownIcon className="h-3 w-3 opacity-60" />
                    </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-auto p-0 border border-border/40 bg-card">
                    <MonthPicker
                        selectedMonth={selectedMonth}
                        onMonthSelect={(date) => {
                            if (date) onMonthSelect(date)
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

export { DashboardHeader }
