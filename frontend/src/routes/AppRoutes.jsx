import { Routes, Route } from "react-router-dom";

import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import UserRoute from "./UserRoute";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../pages/user/Dashboard";
import AdminRoute from "./AdminRoute";
import AdminLayout from "../layout/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AddExpense from "../pages/user/AddExpense";
import ExpenseList from "../pages/user/ExpenseList";
import AddIncome from "../pages/user/AddIncome";
import IncomeList from "../pages/user/IncomeList";
import AllExpenses from "../pages/admin/AllExpenses";
import UserSummary from "../pages/admin/UserSummary";
import Reports from "../pages/admin/Reports";
import VerifyOtp from "../pages/public/VerifyOtp";
import PremiumDashboard from "../pages/premium/PremiumDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

      <Route element={<UserRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/premium" element={<PremiumDashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-expense" element={<AddExpense />} />

          <Route path="/expenses" element={<ExpenseList />} />
          <Route path="/income" element={<IncomeList />} />
          <Route path="/add-income" element={<AddIncome />} />
        </Route>
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/expenses" element={<AllExpenses />} />

          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/users" element={<UserSummary />} />
          <Route path="/admin/reports" element={<Reports />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
