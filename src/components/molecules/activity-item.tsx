import { getCategory } from "@/lib/categories"
import type { Transaction } from "@/lib/loaffly-db"
import { formatCurrency, formatTime } from "@/lib/formatters"

interface ActivityItemProps {
    transaction: Transaction
    walletName: string
}

function ActivityItem({ transaction, walletName }: ActivityItemProps) {
    const cat = getCategory(transaction.category)
    const IconComponent = cat.icon
    const isIncome = transaction.type === "income"

    return (
        <div className="flex items-center justify-between border-b border-border/10 py-2 last:border-0">
            {/* Left: Category Icon & Note/Subtitle */}
            <div className="flex items-center gap-3">
                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full ${cat.color}`}
                >
                    <IconComponent className="h-5 w-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm leading-snug font-semibold text-foreground">
                        {cat.name}
                    </span>
                    <span className="text-xs leading-none text-muted-foreground">
                        {transaction.note}
                    </span>
                </div>
            </div>

            {/* Right: Amount & Wallet / DateTime */}
            <div className="flex flex-col items-end gap-0.5">
                <span
                    className={`text-sm leading-snug font-bold ${
                        isIncome ? "text-success" : "text-destructive"
                    }`}
                >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                </span>
                <span className="text-xs leading-none text-muted-foreground">
                    {walletName} • {formatTime(transaction.date)}
                </span>
            </div>
        </div>
    )
}

export { ActivityItem }
