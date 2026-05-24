import { useState, useRef, useEffect } from "react"
import { toast } from "sonner"
import { useNavigate, useParams } from "react-router"
import { useLiveQuery } from "dexie-react-hooks"
import {
    PencilIcon,
    CalendarIcon,
    WalletIcon,
    ChevronDownIcon,
} from "lucide-react"
import { db } from "@/lib/loaffly-db"
import { SubPageLayout } from "@/layouts/sub-page-layout"
import { CategoryGrid } from "@/components/molecules/category-grid"
import { Numpad } from "@/components/molecules/numpad"
import { CATEGORIES } from "@/lib/categories"
import { formatCurrency } from "@/lib/formatters"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

function NewTransactionPage() {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const transactionId = id ? Number(id) : null
    const isEdit = transactionId !== null
    const datetimeInputRef = useRef<HTMLInputElement>(null)

    // 1. Fetch wallets reactively
    const wallets = useLiveQuery(() => db.wallets.toArray())

    // 2. Fetch existing transaction if editing
    const existingTx = useLiveQuery(async () => {
        if (!transactionId) return undefined
        return await db.transactions.get(transactionId)
    }, [transactionId])

    // 3. Form States
    const [type, setType] = useState<"income" | "expense">("expense")
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
        null
    )
    const [note, setNote] = useState<string>("")
    const [dateTime, setDateTime] = useState<string>(() => {
        // Current date and time in YYYY-MM-DDTHH:mm format for datetime-local
        const now = new Date()
        const yyyy = now.getFullYear()
        const mm = String(now.getMonth() + 1).padStart(2, "0")
        const dd = String(now.getDate()).padStart(2, "0")
        const hh = String(now.getHours()).padStart(2, "0")
        const min = String(now.getMinutes()).padStart(2, "0")
        return `${yyyy}-${mm}-${dd}T${hh}:${min}`
    })
    const [selectedWalletId, setSelectedWalletId] = useState<number | null>(
        null
    )
    const [amount, setAmount] = useState<string>("0")

    // Populate form values if in Edit Mode
    const [hasLoadedExisting, setHasLoadedExisting] = useState(false)
    useEffect(() => {
        if (isEdit && existingTx && !hasLoadedExisting) {
            setType(existingTx.type)
            
            // Match category name to category id
            const matchedCategory = CATEGORIES.find(
                (c) => c.name === existingTx.category && c.type === existingTx.type
            )
            if (matchedCategory) {
                setSelectedCategoryId(matchedCategory.id)
            }
            
            setNote(existingTx.note || "")
            
            if (existingTx.date) {
                setDateTime(existingTx.date.substring(0, 16))
            }
            
            setSelectedWalletId(existingTx.walletId)
            setAmount(String(existingTx.amount))
            setHasLoadedExisting(true)
        }
    }, [isEdit, existingTx, hasLoadedExisting])

    // Set default wallet once loaded (only if not editing, or editing not finished loading)
    if (wallets && wallets.length > 0 && selectedWalletId === null && !isEdit) {
        setSelectedWalletId(wallets[0].id)
    }

    const currentWallet = wallets?.find((w) => w.id === selectedWalletId)

    // Filter categories by type
    const filteredCategories = CATEGORIES.filter((c) => c.type === type)

    // Select category automatically if none selected when type changes
    function handleTypeChange(newType: "income" | "expense") {
        setType(newType)
        setSelectedCategoryId(null) // Reset selection
    }

    function handleNumpadInput(val: string) {
        setAmount((prev) => {
            if (prev === "0") {
                if (val === "." || val === ",") return "0."
                if (val === "-") return "0"
                return val
            }
            if (val === "." || val === ",") {
                if (prev.includes(".") || prev.includes(",")) return prev
                return prev + "."
            }
            if (val === "-") {
                return prev.startsWith("-") ? prev.slice(1) : "-" + prev
            }
            return prev + val
        })
    }

    function handleNumpadDelete() {
        setAmount((prev) => {
            if (prev.length <= 1) return "0"
            return prev.slice(0, -1)
        })
    }

    async function handleNumpadSubmit() {
        const parsedAmount = Math.abs(parseFloat(amount))
        if (isNaN(parsedAmount) || parsedAmount === 0) {
            toast.error("Please enter a valid amount greater than 0.")
            return
        }

        if (!selectedCategoryId) {
            toast.error("Please select a category.")
            return
        }

        if (!selectedWalletId) {
            toast.error("Please select a wallet.")
            return
        }

        // Get the chosen category name
        const categoryObj = CATEGORIES.find((c) => c.id === selectedCategoryId)
        const categoryName = categoryObj ? categoryObj.name : "Other"

        // Build the complete ISO date-time string
        const isoDateTime = `${dateTime}:00`

        const newTx = {
            amount: parsedAmount,
            type,
            category: categoryName,
            walletId: selectedWalletId,
            date: isoDateTime,
            note: note.trim() || undefined,
        }

        if (isEdit && transactionId) {
            await db.transactions.update(transactionId, newTx)
            toast.success("Transaction updated successfully!")
            navigate(`/transactions/${transactionId}`)
        } else {
            await db.transactions.add(newTx as any)
            toast.success("Transaction added successfully!")
            navigate("/")
        }
    }

    // Custom helper to display only the formatted Date (e.g. 23 May)
    const getDisplayedDate = (dateTimeStr: string) => {
        if (!dateTimeStr) return ""
        const [datePart] = dateTimeStr.split("T")
        const parts = datePart.split("-")
        if (parts.length !== 3) return dateTimeStr
        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ]
        const monthIdx = parseInt(parts[1], 10) - 1
        const day = parseInt(parts[2], 10)
        return `${day} ${monthNames[monthIdx]}`
    }

    return (
        <SubPageLayout 
            title={isEdit ? "Edit Transaction" : "New Transaction"} 
            backTo={isEdit && transactionId ? `/transactions/${transactionId}` : "/"}
        >
            {/* Scrollable upper section */}
            <div className="flex flex-col gap-5 pt-2 pb-[350px]">
                {/* 1. Toggle Tab: Income / Expenses using premium shadcn Tabs */}
                <div className="flex justify-center">
                    <Tabs
                        className="h-9 w-full"
                        value={type}
                        onValueChange={(val: any) => handleTypeChange(val)}
                    >
                        <TabsList className="grid h-8 w-full grid-cols-2 bg-secondary/50 p-0.5">
                            <TabsTrigger
                                className="h-7 py-1 text-xs"
                                value="expense"
                            >
                                Expenses
                            </TabsTrigger>
                            <TabsTrigger
                                className="h-7 py-1 text-xs"
                                value="income"
                            >
                                Income
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* 2. Amount Display Area */}
                <div className="flex flex-col items-center justify-center py-1">
                    <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase opacity-85">
                        Amount
                    </span>
                    <div className="mt-0.5 text-2xl font-black text-foreground">
                        {type === "expense" ? "-" : "+"}
                        {formatCurrency(parseFloat(amount) || 0)}
                    </div>
                </div>

                {/* 3. Category Grid */}
                <div className="rounded-xl border border-border/10 bg-secondary/10 p-4">
                    <h3 className="mb-3 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                        Select Category
                    </h3>
                    <CategoryGrid
                        categories={filteredCategories}
                        selectedId={selectedCategoryId}
                        onSelect={setSelectedCategoryId}
                    />
                </div>
            </div>

            {/* Fixed bottom section containing Wallet selector, Note, Date-Time, and Numpad */}
            <div className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-2xl -translate-x-1/2 flex-col gap-2 border-t border-border/30 bg-background/95 px-4 py-2.5 pb-4 backdrop-blur-md sm:px-6">
                {/* 1. Wallet Selector Dropdown using premium shadcn DropdownMenu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="flex h-11 w-full cursor-pointer items-center justify-between rounded-lg border border-input bg-transparent px-3 py-2 text-left outline-hidden transition-colors hover:bg-secondary/15 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                        >
                            <div className="flex items-center gap-3">
                                <WalletIcon className="size-4 text-muted-foreground" />
                                <span className="text-sm font-semibold text-foreground">
                                    {currentWallet
                                        ? currentWallet.name
                                        : "Select Wallet"}
                                </span>
                            </div>
                            <ChevronDownIcon className="size-4 text-muted-foreground" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="z-50 w-[var(--radix-dropdown-menu-trigger-width)] rounded-lg border border-border/50 bg-popover p-1 shadow-md">
                        {wallets?.map((wallet) => (
                            <DropdownMenuItem
                                key={wallet.id}
                                onClick={() => setSelectedWalletId(wallet.id)}
                                className={`flex w-full cursor-pointer items-center justify-between rounded-md p-2.5 text-sm transition-colors focus:bg-secondary/40 focus:text-foreground ${
                                    wallet.id === selectedWalletId
                                        ? "bg-secondary font-semibold text-foreground"
                                        : "text-muted-foreground"
                                }`}
                            >
                                <span>{wallet.name}</span>
                                <span className="text-xs uppercase opacity-75">
                                    {wallet.type}
                                </span>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* 2. Note and Date-Time Inputs using premium shadcn Input */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Note Input */}
                    <div className="relative flex w-full items-center">
                        <PencilIcon className="pointer-events-none absolute left-3 size-3.5 text-muted-foreground" />
                        <Input
                            type="text"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Add note..."
                            className="h-11 rounded-lg border border-input bg-background pl-9 text-xs"
                        />
                    </div>

                    {/* Date-Time Picker Input - fully clickable using showPicker trigger */}
                    <div
                        onClick={() => {
                            if (
                                datetimeInputRef.current &&
                                typeof datetimeInputRef.current.showPicker ===
                                    "function"
                            ) {
                                datetimeInputRef.current.showPicker()
                            }
                        }}
                        className="relative flex w-full cursor-pointer items-center"
                    >
                        <CalendarIcon className="pointer-events-none absolute left-3 z-10 size-3.5 text-muted-foreground" />

                        {/* Hidden Native Picker */}
                        <input
                            ref={datetimeInputRef}
                            type="datetime-local"
                            value={dateTime}
                            onChange={(e) => setDateTime(e.target.value)}
                            className="pointer-events-none absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        />

                        {/* Visible Custom Formatted Date Text Display */}
                        <Input
                            type="text"
                            readOnly
                            value={getDisplayedDate(dateTime)}
                            className="h-11 cursor-pointer rounded-lg border border-input bg-background pl-9 text-xs"
                        />
                    </div>
                </div>

                {/* 3. Numpad Keyboard */}
                <div>
                    <Numpad
                        onInput={handleNumpadInput}
                        onDelete={handleNumpadDelete}
                        onSubmit={handleNumpadSubmit}
                    />
                </div>
            </div>
        </SubPageLayout>
    )
}

export { NewTransactionPage }
