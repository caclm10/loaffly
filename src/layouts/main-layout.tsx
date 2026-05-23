import { Outlet, NavLink } from "react-router"
import { Home, FileHeart, Wallet, User, Plus } from "lucide-react"

function MainLayout() {
  return (
    <div className="min-h-screen w-full bg-background transition-colors duration-300">
      {/* Centered responsive container for web layout */}
      <div className="mx-auto w-full max-w-2xl px-4 py-8 pb-32 sm:px-6">
        
        {/* Dynamic Content Area (Page Router Outlet) */}
        <main>
          <Outlet />
        </main>

        {/* Floating Action Button (FAB) positioned relative to the screen/container */}
        <button className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary shadow-lg hover:scale-105 hover:bg-secondary-foreground/10 active:scale-95 transition-all duration-200 cursor-pointer sm:right-[calc(50vw-21rem)]">
          <Plus className="h-6 w-6 stroke-[2.5]" />
        </button>

        {/* Floating Frosted Bottom Tab Navigation Bar */}
        <nav className="fixed bottom-6 left-1/2 z-40 flex h-16 w-[calc(100%-2rem)] -translate-x-1/2 items-center justify-around rounded-2xl border border-border/40 bg-card/90 backdrop-blur-md px-6 shadow-lg transition-all duration-300 max-w-md sm:w-full">
          {/* Home Nav */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
                isActive ? "text-primary scale-105" : "text-muted-foreground hover:text-primary/70"
              }`
            }
          >
            <Home className="h-5 w-5 stroke-[2.2]" />
            <span>Home</span>
          </NavLink>

          {/* Reports Nav */}
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
                isActive ? "text-primary scale-105" : "text-muted-foreground hover:text-primary/70"
              }`
            }
          >
            <FileHeart className="h-5 w-5 stroke-[2.2]" />
            <span>Reports</span>
          </NavLink>

          {/* Account Nav */}
          <NavLink
            to="/account"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
                isActive ? "text-primary scale-105" : "text-muted-foreground hover:text-primary/70"
              }`
            }
          >
            <Wallet className="h-5 w-5 stroke-[2.2]" />
            <span>Account</span>
          </NavLink>

          {/* Profile Nav */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
                isActive ? "text-primary scale-105" : "text-muted-foreground hover:text-primary/70"
              }`
            }
          >
            <User className="h-5 w-5 stroke-[2.2]" />
            <span>Profile</span>
          </NavLink>
        </nav>

      </div>
    </div>
  )
}

export { MainLayout }
