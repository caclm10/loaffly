import type { Transaction } from "@/lib/loaffly-db"
import { getCategory } from "@/lib/categories"
import { formatDateFull, formatTime } from "@/lib/formatters"

interface TransactionDetailCardProps {
    transaction: Transaction
    walletName: string
}

function TransactionDetailCard({ transaction, walletName }: TransactionDetailCardProps) {
    const category = getCategory(transaction.category)

    const formattedDate = formatDateFull(transaction.date)
    const formattedTime = formatTime(transaction.date)
    const dateDisplay = formattedTime ? `${formattedDate}, ${formattedTime}` : formattedDate

    const rows = [
        { label: "Type", value: transaction.type === "expense" ? "Expenses" : "Income" },
        { label: "Category", value: category.name },
        { label: "Date", value: dateDisplay },
        { label: "Account", value: walletName },
    ]

    return (
        <div>
            <div className="rounded-xl bg-secondary/30 px-4">
                {rows.map((row, index) => (
                    <div
                        key={row.label}
                        className={`flex items-center justify-between py-3 ${
                            index < rows.length - 1 ? "border-b border-border/10" : ""
                        }`}
                    >
                        <span className="text-sm font-semibold text-foreground">
                            {row.label}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            {row.value}
                        </span>
                    </div>
                ))}
            </div>

            {transaction.note && (
                <div className="mt-3 rounded-xl bg-secondary/30 p-4">
                    <span className="text-sm font-semibold text-foreground">
                        Note
                    </span>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {transaction.note}
                    </p>
                </div>
            )}
        </div>
    )
}

export { TransactionDetailCard }
