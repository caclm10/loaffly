import { useMemo } from "react"
import { Link } from "react-router"

import { ActivityItem } from "@/components/molecules/activity-item"
import { formatDateLabel, getDateKey } from "@/lib/formatters"
import type { Transaction, Wallet } from "@/lib/loaffly-db"

interface ActivityListProps {
    transactions: Transaction[]
    wallets: Wallet[]
    isLoading: boolean
}

interface TransactionGroup {
    dateKey: string
    label: string
    items: Transaction[]
}

function ActivityList({ transactions, wallets, isLoading }: ActivityListProps) {
    // Group transactions by day (YYYY-MM-DD)
    const groupedTransactions = useMemo((): TransactionGroup[] => {
        if (!transactions || transactions.length === 0) return []

        const groups = new Map<string, Transaction[]>()

        for (const t of transactions) {
            const key = getDateKey(t.date)
            const existing = groups.get(key)
            if (existing) {
                existing.push(t)
            } else {
                groups.set(key, [t])
            }
        }

        // Convert to array and sort groups by date descending
        return Array.from(groups.entries())
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([dateKey, items]) => ({
                dateKey,
                label: formatDateLabel(items[0].date),
                items: items.sort((a, b) => b.date.localeCompare(a.date)),
            }))
    }, [transactions])

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground">
                    Activity
                </h3>
                <Link
                    to="/transactions"
                    className="text-sm font-medium text-warm-ochre hover:underline"
                >
                    See all
                </Link>
            </div>

            {/* List Container */}
            <div className="flex flex-col gap-5">
                {isLoading ? (
                    [1, 2, 3].map((i) => (
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
                    ))
                ) : groupedTransactions.length === 0 ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                        Belum ada transaksi bulan ini.
                    </div>
                ) : (
                    groupedTransactions.map((group) => (
                        <div
                            key={group.dateKey}
                            className="flex flex-col gap-2"
                        >
                            {/* Day Header */}
                            <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                {group.label}
                            </h4>

                            {/* Items for this day */}
                            <div className="flex flex-col gap-1">
                                {group.items.map((t) => {
                                    const walletName =
                                        wallets.find((w) => w.id === t.walletId)
                                            ?.name || "Wallet"
                                    return (
                                        <Link
                                            key={t.id}
                                            to={`/transactions/${t.id}`}
                                            state={{ from: "/" }}
                                            className="block transition-transform active:scale-[0.99]"
                                        >
                                            <ActivityItem
                                                transaction={t}
                                                walletName={walletName}
                                            />
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export { ActivityList }
