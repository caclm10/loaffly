import { Outlet, NavLink } from "react-router"
import { Home, FileHeart, Wallet, User, Plus } from "lucide-react"

function MainLayout() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-secondary/20 py-0 sm:py-8 transition-colors duration-300">
      {/* Device Frame Wrapper to simulate the premium design screenshot */}
      <div className="relative flex h-full min-h-screen w-full max-w-md flex-col overflow-hidden bg-background shadow-none sm:min-h-[844px] sm:rounded-[40px] sm:border-8 sm:border-primary/95 sm:shadow-2xl">
        
        {/* iOS Status Bar Simulation */}
        <div className="flex h-10 w-full items-center justify-between px-6 pt-3 text-xs font-semibold text-foreground select-none">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            {/* Cellular signal */}
            <div className="flex items-end gap-[2px] h-3">
              <span className="w-[3px] h-[3px] bg-foreground rounded-[1px]" />
              <span className="w-[3px] h-[5px] bg-foreground rounded-[1px]" />
              <span className="w-[3px] h-[7px] bg-foreground rounded-[1px]" />
              <span className="w-[3px] h-[10px] bg-foreground rounded-[1px]" />
            </div>
            {/* Wifi */}
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 21a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-8-8c3-3 8.5-4 12.5-1.5m-17-3C5.5 5 13.5 3.5 19.5 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </svg>
            {/* Battery */}
            <div className="w-5 h-2.5 rounded-[4px] border border-foreground/80 p-[1px] flex items-center">
              <div className="h-full w-4/5 bg-foreground rounded-[2px]" />
            </div>
          </div>
        </div>

        {/* Dynamic Content Area (Page Router Outlet) */}
        <main className="flex-1 overflow-y-auto px-6 py-4 pb-28">
          <Outlet />
        </main>

        {/* Floating Action Button (FAB) from design-01.png */}
        <button className="absolute bottom-24 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary shadow-lg hover:scale-105 hover:bg-secondary-foreground/10 active:scale-95 transition-all duration-200 cursor-pointer">
          <Plus className="h-6 w-6 stroke-[2.5]" />
        </button>

        {/* Premium Bottom Tab Navigation Bar */}
        <nav className="absolute bottom-0 left-0 right-0 flex h-20 items-center justify-around bg-card border-t border-border/30 px-4 pb-3 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
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
