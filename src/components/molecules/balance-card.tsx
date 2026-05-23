import { formatCurrency } from "@/lib/formatters";

interface BalanceCardProps {
    balance: number;
    isLoading: boolean;
}

function BalanceCard({ balance, isLoading }: BalanceCardProps) {

    return (
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-gold-crust to-caramel-crust p-6 text-primary shadow-sm">
            <div className="relative z-10 flex flex-col gap-1">
                <span className="text-xs font-medium tracking-wider text-primary/75 uppercase">
                    Your Balance
                </span>
                <span className="text-3xl font-bold tracking-tight">
                    {isLoading ? "Rp --.---.---" : formatCurrency(balance)}
                </span>
            </div>

            {/* Decorative background loaf path */}
            <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-32 rounded-l-full bg-primary/5 opacity-10" />
        </div>
    );
}

export { BalanceCard };
