import type { Category } from "@/lib/categories"
import { cn } from "@/lib/utils"

interface CategoryGridProps {
    categories: Category[]
    selectedId: string | null
    onSelect: (categoryId: string) => void
}

function CategoryGrid({ categories, selectedId, onSelect }: CategoryGridProps) {
    return (
        <div className="grid grid-cols-4 gap-3">
            {categories.map((category) => {
                const IconComponent = category.icon
                const isSelected = selectedId === category.id

                return (
                    <button
                        key={category.id}
                        type="button"
                        onClick={() => onSelect(category.id)}
                        className="flex flex-col items-center gap-1.5"
                    >
                        <div
                            className={cn(
                                "flex size-12 items-center justify-center rounded-full bg-secondary transition-all",
                                isSelected && "ring-2 ring-warm-ochre ring-offset-2 ring-offset-background"
                            )}
                        >
                            <IconComponent className="size-5 text-primary" />
                        </div>
                        <span
                            className={cn(
                                "text-center text-[10px] leading-tight text-muted-foreground",
                                isSelected && "font-semibold text-warm-ochre"
                            )}
                        >
                            {category.name}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}

export { CategoryGrid }
