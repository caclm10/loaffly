import { useParams, useNavigate, Link } from "react-router"
import { useLiveQuery } from "dexie-react-hooks"
import { Trash2Icon, PencilIcon, MoreHorizontalIcon } from "lucide-react"
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

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"

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
                <Drawer>
                    <DrawerTrigger asChild>
                        <Button
                            size="icon-sm"
                            variant="ghost"
                            aria-label="Account actions"
                        >
                            <MoreHorizontalIcon className="size-5" />
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent className="p-6 border-t border-border/10 bg-card rounded-t-2xl shadow-2xl pb-10">
                        <div className="mx-auto w-full max-w-sm">
                            <DrawerHeader>
                                <DrawerTitle className="font-bold">
                                    Account Actions
                                </DrawerTitle>
                                <DrawerDescription className="text-xs text-muted-foreground mt-1">
                                    Manage your {wallet.name} account settings
                                </DrawerDescription>
                            </DrawerHeader>

                            {/* Grid Actions matching the design-quick-action mockup */}
                            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4">
                                {/* Edit Action Card */}
                                <DrawerClose asChild>
                                    <Button
                                        variant="secondary"
                                        onClick={() => navigate(`/account/${walletId}/edit`)}
                                        className="flex flex-row items-center justify-start h-auto p-3 gap-3 xs:flex-col xs:items-center xs:justify-center xs:gap-1 xs:p-4"
                                    >
                                        <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary xs:mb-1 shrink-0">
                                            <PencilIcon className="size-4" />
                                        </div>
                                        <span className="text-xs font-semibold text-foreground">
                                            Edit Account
                                        </span>
                                    </Button>
                                </DrawerClose>

                                {/* Delete Action Card with nested confirmation */}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            className="flex flex-row items-center justify-start h-auto p-3 gap-3 xs:flex-col xs:items-center xs:justify-center xs:gap-1 xs:p-4"
                                        >
                                            <div className="flex size-9 items-center justify-center rounded-full bg-destructive/10 text-destructive xs:mb-1 shrink-0">
                                                <Trash2Icon className="size-4" />
                                            </div>
                                            <span className="text-xs font-semibold">
                                                Delete Account
                                            </span>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="font-bold">
                                                Delete Account
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete {wallet.name}? All related transactions will be permanently deleted too.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                variant="destructive"
                                                onClick={confirmDelete}
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </DrawerContent>
                </Drawer>
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
