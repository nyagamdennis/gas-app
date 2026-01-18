/* eslint-disable @typescript-eslint/no-unused-vars */
import "./App.css"
import HomePage from "./pages/HomePage"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import SendSmsPage from "./pages/SendSmsPage"
import CustomersPage from "./pages/CustomersPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ProfilePage from "./pages/ProfilePage"
import SalesRecordPage from "./pages/EmployeeHomePage"
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
import EmployeesProfile from "./pages/HR/EmployeesProfile"
import TeamOthersSalesPage from "./pages/TeamOthersSalesPage"
import Transactions from "./pages/Transactions"
import EmployeesProfileDetails from "./pages/HR/EmployeesProfileDetails"
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
import { fetchBusiness } from "./features/company/companySlice"
import { useAppDispatch, useAppSelector } from "./app/hooks"
import useVerificationPolling from "./features/employees/useVerificationPolling"
import Expenses from "./pages/Expenses"
import AiPredict from "./pages/AiPredict"
import AdminOtherProductsSalesRecord from "./pages/AdminOtherProductsSalesRecord"
import ProsessingPayment from "./pages/ProsessingPayment"
import CollectOtherProducts from "./pages/CollectOtherProducts"
import SalesRecordEdit from "./pages/SalesRecordEdit"
import Stockup from "./pages/Stockup"
import Dashboard from "./pages/Dashboard"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Cylinders from "./pages/cylinders/Cylinders"
import TeamsCylinders from "./pages/cylinders/TeamsCylinders"
import StoreCylinders from "./pages/cylinders/StoreCylinders"
import AssignCylinders from "./pages/cylinders/AssignCylinders"
import RefillCylinders from "./pages/cylinders/RefillCylinders"
import AddCylinders from "./pages/cylinders/AddCylinders"
import RepairCylinders from "./pages/cylinders/RepairTeamCylinders"
import RepairCylindersStore from "./pages/cylinders/RepairCylindersStore"
import RepairTeamCylinders from "./pages/cylinders/RepairTeamCylinders"
import { CiRoute } from "react-icons/ci"
import Products from "./pages/otherProducts/Products"
import ProductsActions from "./pages/otherProducts/ProductsActions"
import CollectOtheProducts from "./pages/otherProducts/CollectOtheProducts"
import HrDirection from "./pages/HR/HrDirection"
import ExEmployees from "./pages/HR/ExEmployees"
import PayRoll from "./pages/HR/PayRoll"
import Delivery from "./pages/Deliveries/Delivery"
import ReachoutGroup from "./pages/Reachout/ReachoutGroup"
import AllSales from "./pages/SalesRecord/AllSales"
import TeamsSales from "./pages/SalesRecord/TeamsSales"
import EmployeeAllSales from "./pages/employeePages/Sales/EmployeeAllSales"
import CylinderRetail from "./pages/employeePages/Sales/CylinderRetail"
import CylinderWholesales from "./pages/employeePages/Sales/CylinderWholesales"
import OtherProductsRetail from "./pages/employeePages/Sales/OtherProductsRetail"
import OtherProductsWholesale from "./pages/employeePages/Sales/OtherProductsWholesale"
import { selectIsAuthenticated } from "./features/auths/authSlice"
import TeamsCylindersVehicle from "./pages/cylinders/TeamsCylindersVehicle"
import RepairVehicleCylinder from "./pages/cylinders/RepairVehicleCylinder"
import Recruitment from "./pages/HR/Recruitment"
import Attedance from "./pages/HR/Attedance"
import LeaveManagement from "./pages/HR/LeaveManagement"
import Complaints from "./pages/HR/Complaints"
import Recognition from "./pages/HR/Recognition"
import Leaderboard from "./pages/HR/Leaderboard"
import AdminSettings from "./pages/AdminSettings"
import ShopProducts from "./pages/otherProducts/ShopProducts"
import VehicleProducts from "./pages/otherProducts/VehicleProducts"
import AssignProducts from "./pages/otherProducts/AssignProducts"
import ProductSales from "./pages/SalesRecord/ProductSales"
import CylinderSales from "./pages/SalesRecord/CylinderSales"

function App() {
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
              <ProtectedRoute requiredRole="is_admin">
                <AdminAsign />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/collectothersproducts"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <CollectOtherProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/thecylinders"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <Cylinders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sendsms"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <SendSmsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/sms"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <AdminSms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/salesdata"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <AllSales />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/analysis"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <AdminAnalysis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <CustomersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/sales"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <AdminSalesRecord />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/otherssales"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <AdminOtherProductsSalesRecord />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/expenses"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <Expenses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/deliveries"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <Delivery />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reachout"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <ReachoutGroup />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employees"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <Employee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/createteam"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <CreateTeamPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <AdminAsign />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <Transactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/employees"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <EmployeesProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/ex-employees"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <ExEmployees />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/payroll"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <PayRoll />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admins/employees/:id"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <EmployeesProfileDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cylinders/stock/team/:id/:name"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <TeamsCylinders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cylinders/stock/vehicle/:id/:name"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <TeamsCylindersVehicle />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/stock/team/:id/:name"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <ShopProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/stock/vehicle/:id/:name"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <VehicleProducts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admins/salesdata/:id/:name"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <TeamsSales />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cylinders/stock/store"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <StoreCylinders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cylinders/assign"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <AssignCylinders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cylinders/refill"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <RefillCylinders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/assign"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <AssigningProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subscribe"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <SubScriptionPlans />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/editassigned/:id"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <EditAssignedCylinders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/afterassign/:id"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <AfterAssign />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admins/afterassignproducts/:id"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <AfterAssignOthers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admins/printcollect/:id"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <AfterCollection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/prediction"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <AiPredict />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/assignothers"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <AssigningOtherProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/afterassignothers/:id"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <AfterAssignOthers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/printallcollect/:id"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <AfterCollectionAll />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/collect"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <CollectCylinders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/customers"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <AdminCustomer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <AdminSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teamstock/:teamId/:teamName"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <Stockup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/thecylinders/repair/:teamId/:teamName"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <RepairTeamCylinders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/thecylinders/repair/vehicle/:teamId/:teamName"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <RepairVehicleCylinder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/store/repair"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <RepairCylindersStore />
              </ProtectedRoute>
            }
          />
          <Route
            path="/store/otherproducts"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <ProductsActions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/store/othersproductslist"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <Products />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/assign"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <AssignProducts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/store/collectotherproducts"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <CollectOtheProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/store"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <AdminStore />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cylinders/add"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <AddCylinders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/debtors"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <DebtorsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/overduedebtors"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <OverDueDebtorsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/hr"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <HrDirection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/recruitment"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <Recruitment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/sales/new"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <ProductSales />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/sales/new/shop/:id"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <ProductSales />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/sales/new/vehicle/:id"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <ProductSales />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cylinders/sales/new"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <CylinderSales />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cylinders/sales/new/vehicle/:name/:id"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <CylinderSales />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cylinders/sales/new/shop/:name/:id"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <CylinderSales />
              </ProtectedRoute>
            }
          />

          <Route
            path="/hr/attendance"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <Attedance />
              </ProtectedRoute>
            }
          />

          <Route
            path="/hr/leave"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <LeaveManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/hr/complaints"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <Complaints />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/recognition"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <Recognition />
              </ProtectedRoute>
            }
          />

          <Route
            path="/hr/recognition/leaderboard"
            element={
              <ProtectedRoute requiredRole="is_admin">
                <Leaderboard />
              </ProtectedRoute>
            }
          />

          {/* Employee-only routes - All non-admin roles */}
          <Route
            path="/sales"
            element={
              <ProtectedRoute requiredRole="is_employee">
                <SalesRecordPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales/whatsells"
            element={
              <ProtectedRoute requiredRole="is_employee">
                <EmployeeAllSales />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales/whatsells/retail"
            element={
              <ProtectedRoute requiredRole="is_employee">
                <CylinderRetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales/whatsells/wholesale"
            element={
              <ProtectedRoute requiredRole="is_employee">
                <CylinderWholesales />
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
            path="/sales/whatsells/retailothers"
            element={
              <ProtectedRoute requiredRole="is_employee">
                <OtherProductsRetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales/whatsells/wholesaleothers"
            element={
              <ProtectedRoute requiredRole="is_employee">
                <OtherProductsWholesale />
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
          <Route path="/unverified" element={<UnverifiedPage />} />
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
