import { useMemo, useState } from "react"
import { useLiveQuery } from "dexie-react-hooks"
import { Link } from "react-router"
import { db } from "@/lib/loaffly-db"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ActivityItem } from "@/components/molecules/activity-item"
import { formatDateLabel, getDateKey } from "@/lib/formatters"
import type { Transaction } from "@/lib/loaffly-db"
import { SubPageLayout } from "@/layouts/sub-page-layout"

interface TransactionGroup {
    dateKey: string
    label: string
    items: Transaction[]
}

function AllTransactionPage() {
    const [activeTab, setActiveTab] = useState<string>("all")

    // Fetch transactions and wallets reactively
    const transactions = useLiveQuery(() => db.transactions.toArray())
    const wallets = useLiveQuery(() => db.wallets.toArray())

    // Group and filter transactions based on active tab
    const filteredGroupedTransactions = useMemo((): TransactionGroup[] => {
        if (!transactions) return []

        // 1. Filter
        const filtered = transactions.filter((t) => {
            if (activeTab === "income") return t.type === "income"
            if (activeTab === "expense") return t.type === "expense"
            return true
        })

        // 2. Group by dateKey (YYYY-MM-DD)
        const groups = new Map<string, Transaction[]>()
        for (const t of filtered) {
            const key = getDateKey(t.date)
            const existing = groups.get(key)
            if (existing) {
                existing.push(t)
            } else {
                groups.set(key, [t])
            }
        }

        // 3. Sort groups descending by dateKey, and items descending by date/ID
        return Array.from(groups.entries())
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([dateKey, items]) => ({
                dateKey,
                label: formatDateLabel(items[0].date),
                items: items.sort((a, b) => {
                    const dateCompare = b.date.localeCompare(a.date)
                    if (dateCompare !== 0) return dateCompare
                    return (b.id ?? 0) - (a.id ?? 0)
                }),
            }))
    }, [transactions, activeTab])

    const isLoading = !transactions || !wallets

    return (
        <SubPageLayout title="All transaction" backTo="/">
            <div className="flex flex-col gap-6">
                {/* Filter Tabs using Shadcn Tabs */}
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-3 rounded-full bg-secondary/50 p-1">
                        <TabsTrigger
                            value="all"
                            className="rounded-full data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                        >
                            All activity
                        </TabsTrigger>
                        <TabsTrigger
                            value="income"
                            className="rounded-full data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                        >
                            Income
                        </TabsTrigger>
                        <TabsTrigger
                            value="expense"
                            className="rounded-full data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                        >
                            Expenses
                        </TabsTrigger>
                    </TabsList>

                    {/* Tabs Content */}
                    <div className="mt-6 flex flex-col gap-6">
                        {isLoading ? (
                            <div className="flex flex-col gap-4">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="h-16 w-full animate-pulse rounded-xl bg-secondary/30"
                                    />
                                ))}
                            </div>
                        ) : filteredGroupedTransactions.length === 0 ? (
                            <div className="py-12 text-center text-sm text-muted-foreground">
                                No transactions found.
                            </div>
                        ) : (
                            filteredGroupedTransactions.map((group) => (
                                <div
                                    key={group.dateKey}
                                    className="flex flex-col gap-3"
                                >
                                    {/* Date Group Header */}
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        {group.label}
                                    </h3>

                                    {/* List of Transactions */}
                                    <div className="flex flex-col gap-1">
                                        {group.items.map((transaction) => {
                                            const wallet = wallets?.find(
                                                (w) => w.id === transaction.walletId
                                            )
                                            const walletName =
                                                wallet?.name || "Wallet"
                                            return (
                                                <Link
                                                    key={transaction.id}
                                                    to={`/transactions/${transaction.id}`}
                                                    state={{ from: "/transactions" }}
                                                    className="block transition-transform active:scale-[0.99]"
                                                >
                                                    <ActivityItem
                                                        transaction={transaction}
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
                </Tabs>
            </div>
        </SubPageLayout>
    )
}

export { AllTransactionPage }
