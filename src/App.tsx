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
import AdminAsign from "./pages/AdminHome"
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
import AfterCollection from "./pages/AfterCollection"
import AfterCollectionAll from "./pages/AfterCollectionAll"
import AssigningOtherProducts from "./pages/AssigningOtherProducts"
import AfterAssignOthers from "./pages/AfterAssignOthers"
import EmployeesProfile from "./pages/employeesProfile"
import TeamOthersSalesPage from "./pages/TeamOthersSalesPage"
import Transactions from "./pages/Transactions"
import EmployeesProfileDetails from "./pages/EmployeesProfileDetails"
import CylinderRequest from "./pages/CylinderRequest"
import { useTokenAutoRefresher } from "./features/auths/useTokenAutoRefresher "
import AdminStore from "./pages/AdminStore"
import AdminCustomer from "./pages/AdminCustomer"
import AdminSms from "./pages/AdminSms"
import AdminAnalysis from "./pages/AdminAnalysis"
import EditAssignedCylinders from "./pages/EditAssignedCylinders"
import SubScriptionPlans from "./pages/SubScriptionPlans"
import Settings from "./pages/Settings"
import { useEffect } from "react"
import { fetchBusiness } from "./features/business/businnesSlice"
import { useAppDispatch } from "./app/hooks"
import useVerificationPolling from "./features/employees/useVerificationPolling"
import Expenses from "./pages/Expenses"
import AiPredict from "./pages/AiPredict"
import AdminOtherProductsSalesRecord from "./pages/AdminOtherProductsSalesRecord"
import ProsessingPayment from "./pages/ProsessingPayment"
import CollectOtherProducts from "./pages/CollectOtherProducts"
import SalesRecordEdit from "./pages/SalesRecordEdit"


function App() {
  const dispatch = useAppDispatch()
  
  // useTokenAutoRefresher()

  useVerificationPolling()
  return (
    <div>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/processing" element={<ProsessingPayment />} />

          {/* Admin-only routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute requiredRole="is_owner">
                 <AdminAsign />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/collectothersproducts"
            element={
              <ProtectedRoute requiredRole="is_owner">
                <CollectOtherProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sendsms"
            element={
              <ProtectedRoute requiredRole="is_owner">
                <SendSmsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/sms"
            element={
              <ProtectedRoute requiredRole="is_owner">
                <AdminSms />
              </ProtectedRoute>
            }
          />
          <Route
          path="/admins/analysis"
          element={
            <ProtectedRoute requiredRole="is_owner">
              <AdminAnalysis />
            </ProtectedRoute>
          }
           />
          {/* admins/analysis */}
          <Route
            path="/customers"
            element={
              <ProtectedRoute requiredRole="is_owner">
                <CustomersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/sales"
            element={
              <ProtectedRoute requiredRole="is_owner">
                <AdminSalesRecord />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/otherssales"
            element={
              <ProtectedRoute requiredRole="is_owner">
                <AdminOtherProductsSalesRecord />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/expenses"
            element={
              <ProtectedRoute requiredRole="is_owner">
                <Expenses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedRoute requiredRole="is_owner">
                <Employee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/createteam"
            element={
              <ProtectedRoute requiredRole="is_owner">
                <CreateTeamPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins"
            element={
              <ProtectedRoute requiredRole="is_owner">
                <AdminAsign />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute requiredRole="is_owner">
                <Transactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/employees"
            element={
              <ProtectedRoute requiredRole="is_owner">
                <EmployeesProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/employees/:id"
            element={
              <ProtectedRoute requiredRole="is_owner">
                <EmployeesProfileDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/assign"
            element={
              <ProtectedRoute requiredRole="is_owner">
                <AssigningProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subscribe"
            element={
              <ProtectedRoute requiredRole="is_owner">
                <SubScriptionPlans />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute requiredRole="is_owner">
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/editassigned/:id"
            element={
              <ProtectedRoute requiredRole="is_owner">
                <EditAssignedCylinders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/afterassign/:id"
            element={
              <ProtectedRoute requiredRole="is_owner">
                <AfterAssign />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/printcollect/:id"
            element={
              <ProtectedRoute requiredRole="is_owner">
                <AfterCollection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/prediction"
            element={
              <ProtectedRoute requiredRole="is_owner">
                <AiPredict />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/assignothers"
            element={
              <ProtectedRoute requiredRole="is_owner">
                <AssigningOtherProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/afterassignothers/:id"
            element={
              <ProtectedRoute requiredRole="is_owner">
                <AfterAssignOthers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/printallcollect/:id"
            element={
              <ProtectedRoute requiredRole="is_owner">
                <AfterCollectionAll />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/collect"
            element={
              <ProtectedRoute requiredRole="is_owner">
                <CollectCylinders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/customers"
            element={
              <ProtectedRoute requiredRole="is_owner">
                <AdminCustomer />
              </ProtectedRoute>
            }
          />
          <Route
          path="/admins/store"
          element={
            <ProtectedRoute requiredRole="is_owner">
              <AdminStore />
            </ProtectedRoute>
          }
          />

          <Route
            path="/debtors"
            element={
              <ProtectedRoute requiredRole="is_owner">
                <DebtorsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/overduedebtors"
            element={
              <ProtectedRoute requiredRole="is_owner">
                <OverDueDebtorsPage />
              </ProtectedRoute>
            }
          />

          {/* Employee-only routes */}
          <Route
            path="/sales"
            element={
              <ProtectedRoute requiredRole="is_employee">
                <SalesRecordPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/request"
            element={
              <ProtectedRoute requiredRole="is_employee">
                <CylinderRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wholesalesrecord"
            element={
              <ProtectedRoute requiredRole="is_employee">
                <WholeSaleRecordPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/retailsalesrecord"
            element={
              <ProtectedRoute requiredRole="is_employee">
                <RetailSalesRecordPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teamsales"
            element={
              <ProtectedRoute requiredRole="is_employee">
                <TeamSalesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/salesrecordedit/:id"
            element={
              <ProtectedRoute requiredRole="is_employee">
                <SalesRecordEdit />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/teamotherssales"
            element={
              <ProtectedRoute requiredRole="is_employee">
                <TeamOthersSalesPage />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/otherproducts"
            element={
              <ProtectedRoute requiredRole="is_employee">
                <OtherProductsSale />
              </ProtectedRoute>
            }
          />
          <Route
            path="/salesteamcylinders"
            element={
              <ProtectedRoute requiredRole="is_employee">
                <SalesTeamCylinders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add_customer"
            element={
              <ProtectedRoute requiredRole="is_employee">
                <AddCustomerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/debtors"
            element={
              <ProtectedRoute requiredRole="is_employee">
                <DebtorsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/overduedebtors"
            element={
              <ProtectedRoute requiredRole="is_employee">
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
              <ProtectedRoute requiredRole={["is_employee", "unverified_employee"]}>
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
              <ProtectedRoute requiredRole="unverified_employee">
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
