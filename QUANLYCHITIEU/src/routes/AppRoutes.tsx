import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import ClientLayout from "../layout/ClientLayout";
import AdminLayout from "../layout/AdminLayout";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import Register from "../pages/RegisterPage";
import TransactionPage from "../pages/TransactionPage";
import { WalletPage } from "../pages/WalletPage";
import CategoryListPage from "../pages/ListCategoriesPage";
import TransactionHistoryPage from "../pages/HistoryTransactionPage";
import AddCategoryPage from "../pages/AddCategoryPage";
import StatisticsPage from "../pages/StatisticsPage";
import AccountPage from "../pages/AccountPage";
import TransferPage from "../pages/TransferPage";
import NotFoundPage from "../pages/NotFoundPage";
import AdminDashboard from "../pages/admin/AdminDashboard";

function AppRoutes() {
  return (
    <Routes>
      {/* Client Routes */}
      <Route
        path="/home"
        element={
          <ClientLayout>
            <Home />
          </ClientLayout>
        }
      />
      <Route
        path="/Wallets"
        element={
          <ClientLayout>
            <WalletPage />
          </ClientLayout>
        }
      />
      <Route
        path="/transactions"
        element={
          <ClientLayout>
            <TransactionPage />
          </ClientLayout>
        }
      />
      <Route
        path="/transfer"
        element={
          <ClientLayout>
            <TransferPage />
          </ClientLayout>
        }
      />
      <Route
        path="/categories"
        element={
          <ClientLayout>
            <CategoryListPage />
          </ClientLayout>
        }
      />
      <Route
        path="/history"
        element={
          <ClientLayout>
            <TransactionHistoryPage />
          </ClientLayout>
        }
      />
      <Route
        path="/createCategory"
        element={
          <ClientLayout>
            <AddCategoryPage />
          </ClientLayout>
        }
      />
      <Route
        path="/statistics"
        element={
          <ClientLayout>
            <StatisticsPage />
          </ClientLayout>
        }
      />
      <Route
        path="/account"
        element={
          <ClientLayout>
            <AccountPage />
          </ClientLayout>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/transactions"
        element={
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/statistics"
        element={
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        }
      />

      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />

      {/* 404 Page */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
export default AppRoutes;
