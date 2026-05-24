import { useNavigate } from "react-router"
import { ArrowLeftIcon } from "lucide-react"
import type { ReactNode } from "react"

interface SubPageLayoutProps {
    title: string
    children: ReactNode
    rightAction?: ReactNode
    backTo?: string
    onBack?: () => void
}

function SubPageLayout({ title, children, rightAction, backTo, onBack }: SubPageLayoutProps) {
    const navigate = useNavigate()

    function handleBack() {
        if (onBack) {
            onBack()
        } else if (backTo) {
            navigate(backTo)
        } else {
            navigate(-1)
        }
    }

    return (
        <div className="min-h-screen w-full bg-background transition-colors duration-300">
            <div className="mx-auto w-full max-w-2xl px-4 sm:px-6">
                {/* Top Navigation Bar with Absolute Center Title to prevent text shifts */}
                <div className="relative flex h-14 items-center justify-between">
                    <button
                        onClick={handleBack}
                        className="z-10 flex size-9 items-center justify-center rounded-full text-primary transition-colors hover:bg-secondary"
                    >
                        <ArrowLeftIcon className="size-5 stroke-[2.2]" />
                    </button>
                    
                    <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-semibold text-foreground whitespace-nowrap">
                        {title}
                    </h1>

                    <div className="z-10 flex min-w-9 items-center justify-end">
                        {rightAction}
                    </div>
                </div>

                {/* Page Content */}
                <main className="pb-8 pt-4">{children}</main>
            </div>
        </div>
    )
}

export { SubPageLayout }
