/* eslint-disable @typescript-eslint/no-unused-vars */
import "./App.css"
import HomePage from "./pages/HomePage"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import SendSmsPage from "./pages/SendSmsPage"
import CustomersPage from "./pages/CustomersPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ProfilePage from "./pages/ProfilePage"
import SalesRecordPage from "./pages/SalesRecordPage"
import WholeSaleRecordPage from "./pages/WholeSaleRecordPage"
import RetailSalesRecordPage from "./pages/RetailSalesRecordPage"
import TeamSalesPage from "./pages/TeamSalesPage"
import AssignProductPage from "./pages/AssignProductPage"
import AddCustomerPage from "./pages/AddCustomerPage"
import DebtorsPage from "./pages/DebtorsPage"
import OverDueDebtorsPage from "./pages/OverDueDebtorsPage"
import CreateTeamPage from "./pages/CreateTeamPage"
import ForgotPassword from "./pages/ForgotPassword"
import OnboardingPage from "./pages/OnboardingPage"
import Store from "./pages/Store"
import Employee from "./pages/Employee"
import AdminAsign from "./pages/AdminAsign"
import AssignProducts from "./components/AssignProducts"
import AfterAssign from "./pages/AfterAssign"
import CollectCylinders from "./pages/CollectCylinders"
import SalesTeamCylinders from "./pages/SalesTeamCylinders"
import MyProfilePage from "./pages/MyProfilePage"
import AdminSalesRecord from "./pages/AdminSalesRecord"
import AssigningProducts from "./pages/AssigningProducts"
import CreateProfile from "./pages/CreateProfile"
import ProtectedRoute from "./ProtectedRoute"
import UnverifiedPage from "./pages/UnverifiedPage"
import FiredPage from "./pages/FiredPage"
import SuspendedPage from "./pages/SuspendedPage"
import OtherProductsSale from "./pages/OtherProductsSale"

function App() {
  return (
    <div>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Admin-only routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute requiredRole="admin">
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sendsms"
            element={
              <ProtectedRoute requiredRole="admin">
                <SendSmsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute requiredRole="admin">
                <CustomersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/sales"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminSalesRecord />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedRoute requiredRole="admin">
                <Employee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/createteam"
            element={
              <ProtectedRoute requiredRole="admin">
                <CreateTeamPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminAsign />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/assign"
            element={
              <ProtectedRoute requiredRole="admin">
                <AssigningProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/afterassign/:id"
            element={
              <ProtectedRoute requiredRole="admin">
                <AfterAssign />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/collect"
            element={
              <ProtectedRoute requiredRole="admin">
                <CollectCylinders />
              </ProtectedRoute>
            }
          />

          {/* Employee-only routes */}
          <Route
            path="/sales"
            element={
              <ProtectedRoute requiredRole="employee">
                <SalesRecordPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wholesalesrecord"
            element={
              <ProtectedRoute requiredRole="employee">
                <WholeSaleRecordPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/retailsalesrecord"
            element={
              <ProtectedRoute requiredRole="employee">
                <RetailSalesRecordPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teamsales"
            element={
              <ProtectedRoute requiredRole="employee">
                <TeamSalesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/otherproducts"
            element={
              <ProtectedRoute requiredRole="employee">
                <OtherProductsSale />
              </ProtectedRoute>
            }
          />
          <Route
            path="/salesteamcylinders"
            element={
              <ProtectedRoute requiredRole="employee">
                <SalesTeamCylinders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add_customer"
            element={
              <ProtectedRoute requiredRole="employee">
                <AddCustomerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/debtors"
            element={
              <ProtectedRoute requiredRole="employee">
                <DebtorsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/overduedebtors"
            element={
              <ProtectedRoute requiredRole="employee">
                <OverDueDebtorsPage />
              </ProtectedRoute>
            }
          />

          {/* Shared routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/store"
            element={
              <ProtectedRoute>
                <Store />
              </ProtectedRoute>
            }
          />
          <Route
            path="/myprofile"
            element={
              <ProtectedRoute>
                <MyProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/createprofile"
            element={
              <ProtectedRoute>
                <CreateProfile />
              </ProtectedRoute>
            }
          />

          {/* Special pages */}
          <Route
            path="/unverified"
            element={
              <ProtectedRoute>
                <UnverifiedPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fired"
            element={
              <ProtectedRoute>
                <FiredPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/suspended"
            element={
              <ProtectedRoute>
                <SuspendedPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  )
}

export default App
