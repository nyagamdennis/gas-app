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
import businessReducer from "../features/business/businnesSlice"
import storeReducer from "../features/store/storeSlice";
import otherProductsReducer from "../features/store/otherProductsSlice";
import assignsReducer from "../features/assigns/assignsSlice";
import myProfileReducer from "../features/employees/myProfileSlice";
import salesTeamDataReducer from "../features/salesTeam/salesTeamDataSlice";
import assignedOtherProductsReducer from "../features/product/assignedOtherProductsSlice";

export const store = configureStore({
  reducer: {
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
    business: businessReducer,
    store: storeReducer,
    otherProducts: otherProductsReducer,
    assigns: assignsReducer,
    myProfile: myProfileReducer,
    salesTeamData: salesTeamDataReducer,
    assignedOtherProducts: assignedOtherProductsReducer,

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
