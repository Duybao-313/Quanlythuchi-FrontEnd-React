import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import ClientLayout from "../layout/ClientLayout";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import Register from "../pages/RegisterPage";
import TransactionPage from "../pages/TransactionPage";
import { WalletPage } from "../pages/WalletPage";
import CategoryListPage from "../pages/ListCategoriesPage";
import TransactionHistoryPage from "../pages/HistoryTransactionPage";

function AppRoutes() {
  return (
    <Routes>
  <Route
        path="/home"
        element={
            <ClientLayout>
          <Home/>
          </ClientLayout>
        }
      />
       <Route
        path="/Wallets"
        element={
            <ClientLayout>
          <WalletPage/>
          </ClientLayout>
        }
      />
      <Route
        path="/transactions"
        element={
            <ClientLayout>
          <TransactionPage/>
          </ClientLayout>
        }
      />
      <Route
        path="/categories"
        element={
            <ClientLayout>
          <CategoryListPage/>
          </ClientLayout>
        }
      />
      <Route
        path="/history"
        element={
            <ClientLayout>
          <TransactionHistoryPage/>
          </ClientLayout>
        }
      />
        <Route
        path="/"
        element={
          <LandingPage/>
        }
      />
       <Route
        path="/login"
        element={
          <LoginPage/>
        }
      />
       <Route
        path="/register"
        element={
          <Register/>
        }
      />

    </Routes>
  )
}
export default AppRoutes;