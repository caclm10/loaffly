import Dexie, { type EntityTable } from "dexie"

interface Wallet {
    id: number
    name: string
    type: "bank" | "ewallet" | "cash"
    accountNumber: string
    initialBalance: number
    color: string
    notes?: string
}

interface Transaction {
    id: number
    amount: number
    type: "income" | "expense"
    category: string
    walletId: number
    date: string
    note?: string
}

interface UserProfile {
    id: string
    name: string
    username: string
    avatarUrl?: string
}

class LoafflyDatabase extends Dexie {
    wallets!: EntityTable<Wallet, "id">
    transactions!: EntityTable<Transaction, "id">
    profile!: EntityTable<UserProfile, "id">

    constructor() {
        super("LoafflyDatabase")
        this.version(1).stores({
            wallets: "++id, name, type",
            transactions: "++id, walletId, type, category, date",
            profile: "id",
        })

        // Seed initial data when database is created for the first time
        this.on("populate", () => {
            this.profile.add({
                id: "current-user",
                name: "user",
                username: "user",
            })
        })
    }
}

const db = new LoafflyDatabase()

async function resetDatabase() {
    await db.delete()
    await db.open()
}

export { db, LoafflyDatabase, resetDatabase }
export type { Wallet, Transaction, UserProfile }

