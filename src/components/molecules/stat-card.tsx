import { ArrowUpRightIcon, ArrowDownRightIcon } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

interface StatCardProps {
    type: "income" | "expense";
    amount: number;
    isLoading: boolean;
}

function StatCard({ type, amount, isLoading }: StatCardProps) {

    const isIncome = type === "income";

    return (
        <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4 shadow-sm">
            <div
                className={`flex h-10 w-10 items-center justify-center rounded-full bg-secondary/80 ${
                    isIncome ? "text-success" : "text-destructive"
                }`}
            >
                {isIncome ? (
                    <ArrowUpRightIcon className="h-5 w-5" />
                ) : (
                    <ArrowDownRightIcon className="h-5 w-5" />
                )}
            </div>
            <div className="flex flex-col">
                <span className="text-xs text-muted-foreground capitalize">
                    {type === "expense" ? "Expenses" : "Income"}
                </span>
                <span className="text-sm font-semibold text-foreground">
                    {isLoading ? "Rp --.---.---" : formatCurrency(amount)}
                </span>
            </div>
        </div>
    );
}

export { StatCard };
