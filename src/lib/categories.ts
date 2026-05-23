import {
    Coffee,
    Cookie,
    Car,
    Flame,
    Film,
    Bone,
    BookOpen,
    Gift,
    TrendingUp,
    ShoppingCart,
    Smartphone,
    HelpCircle,
    Briefcase,
    Heart,
    Award,
    DollarSign,
    type LucideIcon,
} from "lucide-react"

interface Category {
    id: string
    name: string
    icon: LucideIcon
    color: string // Background color class or HEX
    type: "income" | "expense"
}

const CATEGORIES: Category[] = [
    // --- Expenses Categories ---
    {
        id: "food",
        name: "Food and beverage",
        icon: Coffee,
        color: "bg-secondary text-primary",
        type: "expense",
    },
    {
        id: "snack",
        name: "Snack",
        icon: Cookie,
        color: "bg-secondary text-primary",
        type: "expense",
    },
    {
        id: "transport",
        name: "Transportation",
        icon: Car,
        color: "bg-secondary text-primary",
        type: "expense",
    },
    {
        id: "exercise",
        name: "Exercise",
        icon: Flame,
        color: "bg-secondary text-primary",
        type: "expense",
    },
    {
        id: "recreation",
        name: "Recreation",
        icon: Film,
        color: "bg-secondary text-primary",
        type: "expense",
    },
    {
        id: "pet",
        name: "Pet",
        icon: Bone,
        color: "bg-secondary text-primary",
        type: "expense",
    },
    {
        id: "learning",
        name: "Learning",
        icon: BookOpen,
        color: "bg-secondary text-primary",
        type: "expense",
    },
    {
        id: "gift_expense",
        name: "Gift",
        icon: Gift,
        color: "bg-secondary text-primary",
        type: "expense",
    },
    {
        id: "investment_expense",
        name: "Investment",
        icon: TrendingUp,
        color: "bg-secondary text-primary",
        type: "expense",
    },
    {
        id: "grocery",
        name: "Grocery",
        icon: ShoppingCart,
        color: "bg-secondary text-primary",
        type: "expense",
    },
    {
        id: "phone",
        name: "Phone",
        icon: Smartphone,
        color: "bg-secondary text-primary",
        type: "expense",
    },
    {
        id: "other",
        name: "Other",
        icon: HelpCircle,
        color: "bg-secondary text-primary",
        type: "expense",
    },

    // --- Income Categories ---
    {
        id: "salary",
        name: "Salary",
        icon: Briefcase,
        color: "bg-secondary text-primary",
        type: "income",
    },
    {
        id: "gift_income",
        name: "Gift",
        icon: Heart,
        color: "bg-secondary text-primary",
        type: "income",
    },
    {
        id: "dividend",
        name: "Dividend",
        icon: DollarSign,
        color: "bg-secondary text-primary",
        type: "income",
    },
    {
        id: "bonus",
        name: "Bonus",
        icon: Award,
        color: "bg-secondary text-primary",
        type: "income",
    },
]

/**
 * Gets a Category object by name or ID with a safe fallback to 'Other'.
 */
function getCategory(idOrName: string): Category {
    const searchKey = idOrName.toLowerCase().trim()
    const found = CATEGORIES.find(
        (c) =>
            c.id.toLowerCase() === searchKey ||
            c.name.toLowerCase() === searchKey
    )

    if (found) return found

    // Fallback to 'Other' category if not found
    return (
        CATEGORIES.find((c) => c.id === "other") || {
            id: "other",
            name: "Other",
            icon: HelpCircle,
            color: "bg-secondary text-primary",
            type: "expense",
        }
    )
}

export { CATEGORIES, getCategory }
export type { Category }
