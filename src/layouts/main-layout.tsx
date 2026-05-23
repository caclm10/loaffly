import { Outlet, NavLink, Link, useLocation } from "react-router"
import {
    HomeIcon,
    FileHeartIcon,
    WalletIcon,
    UserIcon,
    PlusIcon,
} from "lucide-react"

function MainLayout() {
    const location = useLocation()
    const showFab = ["/", "/transactions", "/reports"].includes(location.pathname)

    return (
        <div className="min-h-screen w-full bg-background transition-colors duration-300">
            {/* Centered responsive container for web layout */}
            <div className="mx-auto w-full max-w-2xl px-4 py-8 pb-32 sm:px-6">
                {/* Dynamic Content Area (Page Router Outlet) */}
                <main>
                    <Outlet />
                </main>

                {/* Floating Action Button (FAB) positioned relative to the screen/container */}
                {showFab && (
                    <Link
                        to="/transactions/new"
                        className="fixed right-6 bottom-24 z-50 flex size-14 items-center justify-center rounded-full bg-secondary text-primary shadow-lg transition-all duration-200 hover:scale-105 hover:bg-secondary-foreground/10 active:scale-95 sm:right-[calc(50vw-21rem)]"
                    >
                        <PlusIcon className="size-6 stroke-[2.5]" />
                    </Link>
                )}

                {/* Floating Frosted Bottom Tab Navigation Bar */}
                <nav className="fixed bottom-6 left-1/2 z-40 flex h-16 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-around rounded-xl border border-border/40 bg-card/90 px-6 shadow-lg backdrop-blur-md transition-all duration-300 sm:w-full">
                    {/* Home Nav */}
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
                                isActive
                                    ? "scale-105 text-primary"
                                    : "text-muted-foreground hover:text-primary/70"
                            }`
                        }
                    >
                        <HomeIcon className="h-5 w-5 stroke-[2.2]" />
                        <span>Home</span>
                    </NavLink>

                    {/* Reports Nav */}
                    <NavLink
                        to="/reports"
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
                                isActive
                                    ? "scale-105 text-primary"
                                    : "text-muted-foreground hover:text-primary/70"
                            }`
                        }
                    >
                        <FileHeartIcon className="h-5 w-5 stroke-[2.2]" />
                        <span>Reports</span>
                    </NavLink>

                    {/* Account Nav */}
                    <NavLink
                        to="/account"
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
                                isActive
                                    ? "scale-105 text-primary"
                                    : "text-muted-foreground hover:text-primary/70"
                            }`
                        }
                    >
                        <WalletIcon className="h-5 w-5 stroke-[2.2]" />
                        <span>Account</span>
                    </NavLink>

                    {/* Profile Nav */}
                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
                                isActive
                                    ? "scale-105 text-primary"
                                    : "text-muted-foreground hover:text-primary/70"
                            }`
                        }
                    >
                        <UserIcon className="h-5 w-5 stroke-[2.2]" />
                        <span>Profile</span>
                    </NavLink>
                </nav>
            </div>
        </div>
    )
}

export { MainLayout }
