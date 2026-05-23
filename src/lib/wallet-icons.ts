import {
    Landmark,
    Smartphone,
    Banknote,
    type LucideIcon,
} from "lucide-react"

interface WalletTypeConfig {
    icon: LucideIcon
    label: string
}

const WALLET_TYPE_MAP: Record<string, WalletTypeConfig> = {
    bank: { icon: Landmark, label: "Bank Account" },
    ewallet: { icon: Smartphone, label: "E-Wallet" },
    cash: { icon: Banknote, label: "Cash" },
}

function getWalletTypeConfig(type: string): WalletTypeConfig {
    return (
        WALLET_TYPE_MAP[type] || {
            icon: Banknote,
            label: "Other",
        }
    )
}

export { WALLET_TYPE_MAP, getWalletTypeConfig }
export type { WalletTypeConfig }
