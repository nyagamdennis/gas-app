import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import customerReducer from "../features/customers/customerSlice"
import debtorsReducer from "../features/debtors/debtorsSlice"
import locationsReducer from "../features/location/locationSlice"
import productsReducer from "../features/product/productSlice"
import assignedProductsReducer from "../features/product/assignedProductsSlice"
import salesReducer from "../features/sales/salesSlice"
import authReducer from "../features/auths/authSlice"
import salesTeamReducer from "../features/salesTeam/salesTeamSlice"
import salesTeamManagementReducer from "../features/salesTeam/salesTeamManagementSlice"
import employeesReducer from "../features/employees/employeesSlice"
import firedEmployeesReducer from "../features/employees/firedEmployeesSlice"
import businessReducer from "../features/business/businnesSlice"
import storeReducer from "../features/store/storeSlice"
import otherProductsReducer from "../features/store/otherProductsSlice"
import assignsReducer from "../features/assigns/assignsSlice"
import myProfileReducer from "../features/employees/myProfileSlice"
import salesTeamDataReducer from "../features/salesTeam/salesTeamDataSlice"
import singleSalesTeamDataReducer from "../features/salesTeam/singleSalesTeamDataSlice"
import assignedOtherProductsReducer from "../features/product/assignedOtherProductsSlice"
import adminSalesTeamDataReducer from "../features/salesTeam/adminSalesTeamDataSlice"
import collectionsReducer from "../features/collections/collectionsSlice"
import defaultsReducer from "../features/defaults/defaultsSlice"
import lessPayReducer from "../features/defaults/lessPaySlice"
import assignOthersReducer from "../features/assigns/assignsOthersSlice"
import othersSalesReducer from "../features/sales/othersSalesSlice"
import transactionsReducer from "../features/transactions/transactionsSlice"
import expensesReducer from "../features/expenses/expensesSlice"
import singleEmployeeReducer from "../features/employees/singleEmployeeSlice"
import advancesReducer from "../features/defaults/advancesSlice"
import requestReducer from "../features/RequestCylinders/requestedSlice"
import cashReducer from "../features/cashAtHand/cashSlice"
import teamExpensesReducer from "../features/expenses/teamExpensesSlice"
import salaryReducer from "../features/monthlySalary/salarySlice"
import subscriptionReducer from "../features/subscriptions/subscriptionSlice"
import settingsReducer from "../features/settings/settingsSlice"
import paymentsReducer from "../features/subscriptions/paymentsSlice"
import employeeStatusReducer from "../features/employees/employeeStatusSlice"
import analysisReducer from "../features/analysis/analysisSlice"
import companyExpensesReducer from "../features/expenses/companyExpensesSlice"
import aiAnalysisReducer from "../features/ai/aiAnalysisSlice"
import stockupReducer from "../features/stockup/stockupSlice"
import cylindersBrandReducer from "../features/cylinders/cylindersBrandSlice"
import cylindersWeightReducer from "../features/cylinders/cylindersWeightSlice"
import vehiclesReducer from "../features/deliveries/vehiclesSlice"

export const store = configureStore({
  reducer: {
    vehicles: vehiclesReducer,
    cylindersWeight: cylindersWeightReducer,
    cylindersBrand: cylindersBrandReducer,
    stockup: stockupReducer,
    analysisAi: aiAnalysisReducer,
    companyExpenses: companyExpensesReducer,
    analysis: analysisReducer,
    employeeStatus: employeeStatusReducer,
    payments: paymentsReducer,
    settings: settingsReducer,
    subscription: subscriptionReducer,
    salary: salaryReducer,
    requested: requestReducer,
    customers: customerReducer,
    debtors: debtorsReducer,
    locations: locationsReducer,
    products: productsReducer,
    assignedProducts: assignedProductsReducer,
    sales: salesReducer,
    auth: authReducer,
    salesTeam: salesTeamReducer,
    salesTeamManagement: salesTeamManagementReducer,
    employees: employeesReducer,
    firedEmployees: firedEmployeesReducer,
    business: businessReducer,
    store: storeReducer,
    otherProducts: otherProductsReducer,
    assigns: assignsReducer,
    myProfile: myProfileReducer,
    salesTeamData: salesTeamDataReducer,
    singleSalesTeamData: singleSalesTeamDataReducer,
    assignedOtherProducts: assignedOtherProductsReducer,
    adminSalesTeamData: adminSalesTeamDataReducer,
    collections: collectionsReducer,
    defaults: defaultsReducer,
    lessPay: lessPayReducer,
    assignsOthers: assignOthersReducer,
    othersSales: othersSalesReducer,
    transactions: transactionsReducer,
    expenses: expensesReducer,
    singleEmployee: singleEmployeeReducer,
    advances: advancesReducer,
    cash: cashReducer,
    teamExpenses: teamExpensesReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
