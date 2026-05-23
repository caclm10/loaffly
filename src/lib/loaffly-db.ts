import Dexie, { type EntityTable } from "dexie"

interface Wallet {
    id: number
    name: string
    type: "bank" | "ewallet" | "cash" | "savings"
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
                name: "Lewin Xander",
                username: "lewin",
            })

            this.wallets.bulkAdd([
                {
                    id: 1,
                    name: "Mandiri",
                    type: "bank",
                    accountNumber: "1234567",
                    initialBalance: 3000000,
                    color: "#4A3728", // Deep Cocoa / Espresso
                    notes: "Gaji Bulanan",
                },
                {
                    id: 2,
                    name: "Cash",
                    type: "cash",
                    accountNumber: "1234567",
                    initialBalance: 3100000,
                    color: "#B26A3A", // Warm Ochre
                    notes: "Uang Fisik",
                },
                {
                    id: 3,
                    name: "Gopay",
                    type: "ewallet",
                    accountNumber: "1234567",
                    initialBalance: 1200000,
                    color: "#D84315", // Terracotta
                    notes: "Pengeluaran Harian",
                },
            ])

            this.transactions.bulkAdd([
                {
                    id: 1,
                    amount: 140000,
                    type: "income",
                    category: "Bonus",
                    walletId: 1, // Mandiri
                    date: "2024-05-05T08:30:00",
                    note: "Bonus proyek sampingan",
                },
                {
                    id: 2,
                    amount: 250000,
                    type: "expense",
                    category: "Snack",
                    walletId: 3, // Gopay
                    date: "2024-05-05T16:15:00",
                    note: "Beli camilan sore",
                },
                {
                    id: 3,
                    amount: 150000,
                    type: "expense",
                    category: "Transportation",
                    walletId: 3, // Gopay
                    date: "2024-05-05T09:41:00",
                    note: "Grab ke kantor",
                },
                {
                    id: 4,
                    amount: 140000,
                    type: "expense",
                    category: "Food and beverage",
                    walletId: 3, // Gopay
                    date: "2024-05-05T20:00:00",
                    note: "Makan malam",
                },
                {
                    id: 5,
                    amount: 100000,
                    type: "expense",
                    category: "Gift",
                    walletId: 2, // Cash
                    date: "2024-05-04T12:00:00",
                    note: "Kado ulang tahun",
                },
                {
                    id: 6,
                    amount: 300000,
                    type: "expense",
                    category: "Entertain",
                    walletId: 2, // Cash
                    date: "2024-05-04T19:30:00",
                    note: "Nonton bioskop & makan",
                },
                {
                    id: 7,
                    amount: 100000,
                    type: "expense",
                    category: "Pet",
                    walletId: 3, // Gopay
                    date: "2024-05-04T10:45:00",
                    note: "Buy at zorro petshop",
                },
            ])
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

