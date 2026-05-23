import { useNavigate } from "react-router"
import { useLiveQuery } from "dexie-react-hooks"
import { ListPlusIcon } from "lucide-react"
import { db } from "@/lib/loaffly-db"
import { WalletCard } from "@/components/molecules/wallet-card"

function AccountPage() {
    const navigate = useNavigate()

    // Reactively fetch wallets and transactions
    const wallets = useLiveQuery(() => db.wallets.toArray())
    const transactions = useLiveQuery(() => db.transactions.toArray())

    const isLoading = !wallets || !transactions

    // Calculate balances per wallet
    const walletBalances = wallets && transactions
        ? wallets.map((wallet) => {
              const walletTx = transactions.filter((t) => t.walletId === wallet.id)
              const income = walletTx
                  .filter((t) => t.type === "income")
                  .reduce((sum, t) => sum + t.amount, 0)
              const expenses = walletTx
                  .filter((t) => t.type === "expense")
                  .reduce((sum, t) => sum + t.amount, 0)
              const balance = wallet.initialBalance + income - expenses
              return { wallet, balance }
          })
        : []

    return (
        <div className="flex flex-col gap-6">
            {/* Header row with Title & Add button */}
            <div className="flex h-14 items-center justify-between">
                <h1 className="text-base font-semibold text-foreground">
                    Account
                </h1>
                <button
                    onClick={() => navigate("/account/new")}
                    className="flex size-9 items-center justify-center rounded-full text-warm-ochre transition-colors hover:bg-secondary/40"
                    aria-label="Add account"
                >
                    <ListPlusIcon className="size-5" />
                </button>
            </div>

            {/* List of Wallet Cards */}
            <div className="flex flex-col gap-3">
                {isLoading ? (
                    [1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-16 w-full animate-pulse rounded-xl bg-secondary/30"
                        />
                    ))
                ) : walletBalances.length === 0 ? (
                    <div className="py-12 text-center text-sm text-muted-foreground border border-dashed border-border/40 rounded-xl">
                        No accounts created. Click "+" to add one.
                    </div>
                ) : (
                    walletBalances.map(({ wallet, balance }) => (
                        <WalletCard
                            key={wallet.id}
                            wallet={wallet}
                            balance={balance}
                            onClick={() => navigate(`/account/${wallet.id}`)}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

export { AccountPage }
