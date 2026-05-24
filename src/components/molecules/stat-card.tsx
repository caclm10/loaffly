import { ArrowUpRightIcon, ArrowDownRightIcon } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface StatCardProps {
    type: "income" | "expense";
    amount: number;
    isLoading: boolean;
}

function StatCard({ type, amount, isLoading }: StatCardProps) {
    const isIncome = type === "income";
    const formattedValue = isLoading ? "Rp --.---.---" : formatCurrency(amount);

    return (
        <div className="flex flex-col gap-1.5 xs:flex-row xs:items-center xs:gap-3 rounded-xl border border-border/50 bg-card p-4 shadow-sm">
            <div
                className={cn(
                    "hidden xs:flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-full bg-secondary/80",
                    isIncome ? "text-success" : "text-destructive"
                )}
            >
                {isIncome ? (
                    <ArrowUpRightIcon className="size-4.5 sm:size-5" />
                ) : (
                    <ArrowDownRightIcon className="size-4.5 sm:size-5" />
                )}
            </div>
            <div className="flex flex-col min-w-0 w-full xs:w-auto">
                <div className="flex items-center justify-between xs:block w-full">
                    <span className="text-xs text-muted-foreground capitalize">
                        {type === "expense" ? "Expenses" : "Income"}
                    </span>
                    <div className="xs:hidden">
                        {isIncome ? (
                            <ArrowUpRightIcon className="size-4 text-success" />
                        ) : (
                            <ArrowDownRightIcon className="size-4 text-destructive" />
                        )}
                    </div>
                </div>
                <span className="text-sm font-semibold text-foreground truncate mt-0.5 xs:mt-0">
                    {formattedValue}
                </span>
            </div>
        </div>
    );
}

export { StatCard };
