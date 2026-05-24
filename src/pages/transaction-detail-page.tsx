import { useParams, useNavigate, useLocation } from "react-router"
import { useLiveQuery } from "dexie-react-hooks"
import { Trash2Icon, PencilIcon, MoreHorizontalIcon } from "lucide-react"
import { db } from "@/lib/loaffly-db"
import { SubPageLayout } from "@/layouts/sub-page-layout"
import { TransactionDetailCard } from "@/components/molecules/transaction-detail-card"
import { getCategory } from "@/lib/categories"
import { formatCurrency } from "@/lib/formatters"

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
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

function TransactionDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const location = useLocation()
    const txId = Number(id)

    // Reactively fetch transaction and wallets
    const transaction = useLiveQuery(() => db.transactions.get(txId), [txId])
    const wallets = useLiveQuery(() => db.wallets.toArray())

    const walletName =
        wallets && transaction
            ? wallets.find((w) => w.id === transaction.walletId)?.name ||
            "Wallet"
            : "Wallet"

    // Context-aware back path
    const backToPath = location.state?.from || "/transactions"

    async function confirmDelete() {
        await db.transactions.delete(txId)
        navigate(backToPath)
    }

    if (!transaction) {
        return (
            <SubPageLayout title="Detail transaction" backTo={backToPath}>
                <div className="flex h-64 animate-pulse items-center justify-center text-sm text-muted-foreground">
                    Loading transaction...
                </div>
            </SubPageLayout>
        )
    }

    const category = getCategory(transaction.category)
    const CategoryIcon = category.icon
    const isExpense = transaction.type === "expense"

    return (
        <SubPageLayout
            title="Detail transaction"
            backTo={backToPath}
            rightAction={
                <Drawer>
                    <DrawerTrigger asChild>
                        <Button
                            size="icon-sm"
                            variant="ghost"
                            aria-label="Transaction actions"
                        >
                            <MoreHorizontalIcon className="size-5" />
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent className="p-6 pb-10">
                        <div className="mx-auto w-full max-w-sm">
                            <DrawerHeader >
                                <DrawerTitle className="text-base font-bold text-foreground">
                                    Transaction Actions
                                </DrawerTitle>
                                <DrawerDescription className="text-xs text-muted-foreground mt-1">
                                    Manage your transaction settings
                                </DrawerDescription>
                            </DrawerHeader>

                            {/* Grid Actions matching the design-quick-action mockup */}
                            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4">
                                {/* Edit Action Card */}
                                <DrawerClose asChild>
                                    <Button
                                        variant="secondary"
                                        onClick={() => navigate(`/transactions/${txId}/edit`)}
                                        className="flex flex-row items-center justify-start h-auto p-3 gap-3 xs:flex-col xs:items-center xs:justify-center xs:gap-1 xs:p-4"
                                    >
                                        <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary xs:mb-1 shrink-0">
                                            <PencilIcon className="size-4" />
                                        </div>
                                        <span className="text-xs font-semibold text-foreground">
                                            Edit Transaction
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
                                                Delete Transaction
                                            </span>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="max-w-sm">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="font-bold">
                                                Delete Transaction
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete this transaction? This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
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
            <div className="flex flex-col items-center gap-8 py-4">
                {/* Visual Overview Header */}
                <div className="flex flex-col items-center gap-3 text-center">
                    {/* Category Icon Bubble */}
                    <div className="flex size-20 items-center justify-center rounded-full bg-secondary text-primary">
                        <CategoryIcon className="size-9" />
                    </div>

                    {/* Amount Spent / Received Label */}
                    <span className="text-sm text-muted-foreground">
                        {isExpense ? "Amount spent" : "Amount received"}
                    </span>

                    {/* Large Amount Display */}
                    <h2 className="text-3xl font-bold text-foreground">
                        {isExpense ? "-" : "+"}
                        {formatCurrency(transaction.amount)}
                    </h2>

                    {/* Transaction Type Badge */}
                    <span
                        className={`rounded-full border px-4 py-1 text-xs font-semibold tracking-wider uppercase ${isExpense
                            ? "border-destructive/30 bg-destructive/5 text-destructive"
                            : "border-success/30 bg-success/5 text-success"
                            }`}
                    >
                        {isExpense ? "Expenses" : "Income"}
                    </span>
                </div>

                {/* Key Value Details Card */}
                <div className="w-full">
                    <TransactionDetailCard
                        transaction={transaction}
                        walletName={walletName}
                    />
                </div>
            </div>
        </SubPageLayout>
    )
}

export { TransactionDetailPage }
