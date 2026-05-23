import { useParams, useNavigate, Link } from "react-router"
import { useLiveQuery } from "dexie-react-hooks"
import { Trash2Icon, PencilIcon } from "lucide-react"
import { db } from "@/lib/loaffly-db"
import { SubPageLayout } from "@/layouts/sub-page-layout"
import { WalletDetailCard } from "@/components/molecules/wallet-detail-card"
import { ActivityItem } from "@/components/molecules/activity-item"
import { formatDateLabel, getDateKey } from "@/lib/formatters"
import type { Transaction } from "@/lib/loaffly-db"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function AccountDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const walletId = Number(id)

    // Reactively fetch wallet, transactions
    const wallet = useLiveQuery(() => db.wallets.get(walletId), [walletId])
    const allTransactions = useLiveQuery(() => db.transactions.toArray())

    // Filter and compute balance for this wallet
    const walletData = wallet && allTransactions
        ? (() => {
              const txs = allTransactions.filter((t) => t.walletId === wallet.id)
              const income = txs
                  .filter((t) => t.type === "income")
                  .reduce((sum, t) => sum + t.amount, 0)
              const expenses = txs
                  .filter((t) => t.type === "expense")
                  .reduce((sum, t) => sum + t.amount, 0)
              const balance = wallet.initialBalance + income - expenses

              // Group transactions by day YYYY-MM-DD
              const groups = new Map<string, Transaction[]>()
              for (const t of txs) {
                  const key = getDateKey(t.date)
                  const existing = groups.get(key)
                  if (existing) {
                      existing.push(t)
                  } else {
                      groups.set(key, [t])
                  }
              }

              const grouped = Array.from(groups.entries())
                  .sort(([a], [b]) => b.localeCompare(a))
                  .map(([dateKey, items]) => ({
                      dateKey,
                      label: formatDateLabel(items[0].date),
                      items: items.sort((a, b) => b.date.localeCompare(a.date)),
                  }))

              return { balance, groupedTransactions: grouped }
          })()
        : null

    async function confirmDelete() {
        if (!wallet) return
        // Delete wallet
        await db.wallets.delete(walletId)
        // Delete related transactions
        const txs = await db.transactions.where("walletId").equals(walletId).toArray()
        for (const tx of txs) {
            if (tx.id) await db.transactions.delete(tx.id)
        }
        navigate("/account")
    }

    if (!wallet || !walletData) {
        return (
            <SubPageLayout title="Detail account" backTo="/account">
                <div className="flex h-64 items-center justify-center text-sm text-muted-foreground animate-pulse">
                    Loading account details...
                </div>
            </SubPageLayout>
        )
    }

    return (
        <SubPageLayout
            title="Detail account"
            backTo="/account"
            rightAction={
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => navigate(`/account/${walletId}/edit`)}
                        className="flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
                        aria-label="Edit account"
                    >
                        <PencilIcon className="size-4" />
                    </button>
                    
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button
                                className="flex size-9 items-center justify-center rounded-full text-destructive transition-colors hover:bg-destructive/10"
                                aria-label="Delete account"
                            >
                                <Trash2Icon className="size-4" />
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="border border-border/50 bg-popover p-6 shadow-xl backdrop-blur-md max-w-sm">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-lg font-bold text-foreground">
                                    Delete Account
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
                                    Are you sure you want to delete {wallet.name}? All related transactions will be permanently deleted too.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex flex-row justify-end gap-2 mt-4">
                                <AlertDialogCancel className="rounded-xl">
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    variant="destructive"
                                    onClick={confirmDelete}
                                    className="rounded-xl"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            }
        >
            <div className="flex flex-col gap-6">
                {/* Large Wallet Information Card */}
                <WalletDetailCard
                    wallet={wallet}
                    balance={walletData.balance}
                />

                {/* Transaction list specific to this wallet */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-sm font-semibold text-foreground">
                        Transaction History
                    </h3>

                    <div className="flex flex-col gap-6">
                        {walletData.groupedTransactions.length === 0 ? (
                            <div className="py-12 text-center text-sm text-muted-foreground border border-dashed border-border/40 rounded-xl bg-secondary/10">
                                No transaction history found for this account.
                            </div>
                        ) : (
                            walletData.groupedTransactions.map((group) => (
                                <div
                                    key={group.dateKey}
                                    className="flex flex-col gap-3"
                                >
                                    {/* Date Group Header */}
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        {group.label}
                                    </h4>

                                    {/* List of items */}
                                    <div className="flex flex-col gap-1">
                                        {group.items.map((transaction) => (
                                            <Link
                                                key={transaction.id}
                                                to={`/transactions/${transaction.id}`}
                                                state={{ from: `/account/${walletId}` }}
                                                className="block transition-transform active:scale-[0.99]"
                                            >
                                                <ActivityItem
                                                    transaction={transaction}
                                                    walletName={wallet.name}
                                                />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </SubPageLayout>
    )
}

export { AccountDetailPage }
