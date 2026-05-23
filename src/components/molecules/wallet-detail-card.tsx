import type { Wallet } from "@/lib/loaffly-db"
import { getWalletTypeConfig } from "@/lib/wallet-icons"
import { formatCurrency } from "@/lib/formatters"

interface WalletDetailCardProps {
    wallet: Wallet
    balance: number
}

function WalletDetailCard({ wallet, balance }: WalletDetailCardProps) {
    const config = getWalletTypeConfig(wallet.type)
    const IconComponent = config.icon

    return (
        <div className="rounded-xl bg-secondary p-5">
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-foreground">
                        {wallet.name}
                    </span>
                    {wallet.type !== "cash" && (
                        <span className="text-xs text-muted-foreground">
                            {wallet.accountNumber}
                        </span>
                    )}
                </div>
                <div className="flex size-10 items-center justify-center rounded-full bg-secondary">
                    <IconComponent className="size-5 text-primary" />
                </div>
            </div>

            <p className="mt-4 text-2xl font-bold text-foreground">
                {formatCurrency(balance)}
            </p>
        </div>
    )
}

export { WalletDetailCard }
