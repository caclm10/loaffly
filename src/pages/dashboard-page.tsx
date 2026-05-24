import { useState, useMemo, useEffect } from "react"
import { useLiveQuery } from "dexie-react-hooks"
import { db } from "@/lib/loaffly-db"
import { DashboardHeader } from "@/components/organisms/dashboard-header"
import { BalanceCard } from "@/components/molecules/balance-card"
import { StatCard } from "@/components/molecules/stat-card"
import { ActivityList } from "@/components/organisms/activity-list"

function DashboardPage() {
    // Fetch live reactive data from Dexie database
    const profile = useLiveQuery(() => db.profile.get("current-user"))
    const wallets = useLiveQuery(() => db.wallets.toArray())
    const transactions = useLiveQuery(() => db.transactions.toArray())

    // 1. Month Picker states and initialization logic
    const [selectedMonth, setSelectedMonth] = useState<Date>(() => new Date())
    const [hasInitializedMonth, setHasInitializedMonth] = useState(false)

    // Auto-select the latest transaction's month once transactions load
    useEffect(() => {
        if (transactions && transactions.length > 0 && !hasInitializedMonth) {
            const latestTx = [...transactions].sort((a, b) => b.date.localeCompare(a.date))[0]
            if (latestTx) {
                const parts = latestTx.date.split("-")
                if (parts.length >= 2) {
                    setSelectedMonth(new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, 1))
                    setHasInitializedMonth(true)
                }
            }
        }
    }, [transactions, hasInitializedMonth])

    const targetMonthStr = useMemo(() => {
        const yyyy = selectedMonth.getFullYear()
        const mm = String(selectedMonth.getMonth() + 1).padStart(2, "0")
        return `${yyyy}-${mm}`
    }, [selectedMonth])

    // 2. Calculate Wallet Balances and Total Balance (all-time)
    const totalBalance = useMemo(() => {
        if (!wallets || !transactions) return 0
        return wallets.reduce((sum, wallet) => {
            const walletTx = transactions.filter(
                (t) => t.walletId === wallet.id
            )
            const incomeSum = walletTx
                .filter((t) => t.type === "income")
                .reduce((s, t) => s + t.amount, 0)
            const expenseSum = walletTx
                .filter((t) => t.type === "expense")
                .reduce((s, t) => s + t.amount, 0)
            return sum + wallet.initialBalance + incomeSum - expenseSum
        }, 0)
    }, [wallets, transactions])

    // 3. Calculate Monthly Stats for the selected active month
    const monthlyStats = useMemo(() => {
        if (!transactions) return { income: 0, expenses: 0 }

        const monthTx = transactions.filter((t) => t.date.startsWith(targetMonthStr))
        const income = monthTx
            .filter((t) => t.type === "income")
            .reduce((s, t) => s + t.amount, 0)
        const expenses = monthTx
            .filter((t) => t.type === "expense")
            .reduce((s, t) => s + t.amount, 0)
        return { income, expenses }
    }, [transactions, targetMonthStr])

    // 4. Get Transactions for the selected active month
    const recentTransactions = useMemo(() => {
        if (!transactions) return []
        return [...transactions]
            .filter((t) => t.date.startsWith(targetMonthStr))
            .sort((a, b) => {
                const dateCompare = b.date.localeCompare(a.date)
                if (dateCompare !== 0) return dateCompare
                return (b.id ?? 0) - (a.id ?? 0)
            })
    }, [transactions, targetMonthStr])

    const isLoading = !wallets || !transactions

    return (
        <div className="flex flex-col gap-6">
            {/* Header Section */}
            <DashboardHeader
                profileName={profile?.name}
                selectedMonth={selectedMonth}
                onMonthSelect={setSelectedMonth}
            />

            {/* Balance Card */}
            <BalanceCard balance={totalBalance} isLoading={isLoading} />

            {/* Income / Expense Stats */}
            <div className="grid grid-cols-2 gap-4">
                <StatCard
                    type="income"
                    amount={monthlyStats.income}
                    isLoading={isLoading}
                />
                <StatCard
                    type="expense"
                    amount={monthlyStats.expenses}
                    isLoading={isLoading}
                />
            </div>

            {/* Activity List Section */}
            <ActivityList
                transactions={recentTransactions}
                wallets={wallets || []}
                isLoading={isLoading}
            />
        </div>
    )
}

export { DashboardPage }
