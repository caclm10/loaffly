import {
    Calendar,
    ChevronDown,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react"

function DashboardPage() {
    return (
        <div className="flex flex-col gap-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                {/* Profile / Greeting */}
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cool-mist text-primary">
                        <span className="text-lg font-semibold">LX</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                            Good Morning
                        </span>
                        <h2 className="text-base leading-tight font-semibold text-foreground">
                            Lewin Xander
                        </h2>
                    </div>
                </div>

                {/* Date Selector */}
                <button className="flex items-center gap-2 rounded-xl bg-secondary/50 px-3 py-2 text-sm font-medium text-warm-ochre transition-colors hover:bg-secondary">
                    <Calendar className="h-4 w-4" />
                    <span>May</span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                </button>
            </div>

            {/* Balance Card Skeleton */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gold-crust to-caramel-crust p-6 text-primary shadow-sm">
                <div className="relative z-10 flex flex-col gap-1">
                    <span className="text-xs font-medium tracking-wider text-primary/75 uppercase">
                        Your Balance
                    </span>
                    <span className="text-3xl font-bold tracking-tight">
                        Rp --.---.---
                    </span>
                </div>

                {/* Decorative background loaf path */}
                <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-32 rounded-l-full bg-primary/5 opacity-10" />
            </div>

            {/* Income / Expense Stats Placeholder */}
            <div className="grid grid-cols-2 gap-4">
                {/* Income Card */}
                <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/80 text-success">
                        <ArrowUpRight className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                            Income
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                            Rp --.---.---
                        </span>
                    </div>
                </div>

                {/* Expense Card */}
                <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/80 text-destructive">
                        <ArrowDownRight className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                            Expenses
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                            Rp --.---.---
                        </span>
                    </div>
                </div>
            </div>

            {/* Activity List Section Placeholder */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-foreground">
                        Activity
                    </h3>
                    <button className="text-sm font-medium text-warm-ochre hover:underline">
                        See all
                    </button>
                </div>

                {/* Empty State / Skeleton List */}
                <div className="flex flex-col gap-3">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between border-b border-border/10 py-2 last:border-0"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-11 w-11 animate-pulse rounded-full bg-secondary" />
                                <div className="flex flex-col gap-1.5">
                                    <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                                    <div className="h-3 w-16 animate-pulse rounded bg-muted/65" />
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-1.5">
                                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                                <div className="h-3 w-12 animate-pulse rounded bg-muted/65" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export { DashboardPage }
