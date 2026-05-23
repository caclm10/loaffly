import type { Wallet } from "@/lib/loaffly-db"
import { getWalletTypeConfig } from "@/lib/wallet-icons"
import { formatCurrency } from "@/lib/formatters"

interface WalletCardProps {
    wallet: Wallet
    balance: number
    onClick: () => void
}

function WalletCard({ wallet, balance, onClick }: WalletCardProps) {
    const config = getWalletTypeConfig(wallet.type)
    const IconComponent = config.icon

    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center justify-between rounded-xl bg-secondary/50 p-4 text-left transition-colors active:bg-secondary/70"
        >
            <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-secondary">
                    <IconComponent className="size-5 text-primary" />
                </div>
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
            </div>

            <span className="text-sm font-bold text-foreground">
                {formatCurrency(balance)}
            </span>
        </button>
    )
}

export { WalletCard }
