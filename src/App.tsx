import { BrowserRouter, Routes, Route } from "react-router"
import { MainLayout } from "@/layouts/main-layout"
import { DashboardPage } from "@/pages/dashboard-page"
import { AllTransactionPage } from "@/pages/all-transaction-page"
import { TransactionDetailPage } from "@/pages/transaction-detail-page"
import { NewTransactionPage } from "@/pages/new-transaction-page"
import { ReportsPage } from "@/pages/reports-page"
import { AccountPage } from "@/pages/account-page"
import { AccountDetailPage } from "@/pages/account-detail-page"
import { AccountFormPage } from "@/pages/account-form-page"
import { ProfilePage } from "@/pages/profile-page"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Main layout routes (with bottom nav + FAB) */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route
                        path="transactions"
                        element={<AllTransactionPage />}
                    />
                    <Route path="reports" element={<ReportsPage />} />
                    <Route path="account" element={<AccountPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                </Route>

                {/* Sub-page routes (no bottom nav, own layout) */}
                <Route
                    path="/transactions/:id"
                    element={<TransactionDetailPage />}
                />
                <Route
                    path="/transactions/new"
                    element={<NewTransactionPage />}
                />
                <Route
                    path="/account/:id"
                    element={<AccountDetailPage />}
                />
                <Route
                    path="/account/new"
                    element={<AccountFormPage />}
                />
                <Route
                    path="/account/:id/edit"
                    element={<AccountFormPage />}
                />
            </Routes>
        </BrowserRouter>
    )
}

export { App }
