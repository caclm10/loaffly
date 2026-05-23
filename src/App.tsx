import { BrowserRouter, Routes, Route } from "react-router"
import { MainLayout } from "@/layouts/main-layout"
import { DashboardPage } from "@/pages/dashboard-page"
import { ReportsPage } from "@/pages/reports-page"
import { AccountPage } from "@/pages/account-page"
import { ProfilePage } from "@/pages/profile-page"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="reports" element={<ReportsPage />} />
                    <Route path="account" element={<AccountPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export { App }
