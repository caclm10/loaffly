import { useMemo } from "react"
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

    // 1. Calculate Wallet Balances and Total Balance
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

    // 2. Calculate Monthly Stats for May 2024 (as pictured in design-01.png)
    const monthlyStats = useMemo(() => {
        if (!transactions) return { income: 0, expenses: 0 }
        // Filter transactions for May 2024 ("2024-05")
        const mayTx = transactions.filter((t) => t.date.startsWith("2024-05"))
        const income = mayTx
            .filter((t) => t.type === "income")
            .reduce((s, t) => s + t.amount, 0)
        const expenses = mayTx
            .filter((t) => t.type === "expense")
            .reduce((s, t) => s + t.amount, 0)
        return { income, expenses }
    }, [transactions])

    // 3. Get Recent 3 Transactions
    const recentTransactions = useMemo(() => {
        if (!transactions) return []
        // Sort by date descending, then ID descending, take top 3
        return [...transactions]
            .sort((a, b) => {
                const dateCompare = b.date.localeCompare(a.date)
                if (dateCompare !== 0) return dateCompare
                return (b.id ?? 0) - (a.id ?? 0)
            })
            .slice(0, 5)
    }, [transactions])

    const isLoading = !wallets || !transactions

    return (
        <div className="flex flex-col gap-6">
            {/* Header Section */}
            <DashboardHeader profileName={profile?.name} />

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
