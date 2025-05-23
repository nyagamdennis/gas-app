/* eslint-disable prettier/prettier */
import { compose, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../../utils/api"


interface CompanyExpenses {
  id: string
  expense_name: string
  amount: number
  date: string
}

interface CompanyExpensesState {
  companyExpenses: CompanyExpenses[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: CompanyExpensesState = {
  companyExpenses: [],
  status: "idle",
  error: null,
}

export const fetchCompanyExpenses = createAsyncThunk<CompanyExpenses[]>(
  "companyExpenses/fetchCompanyExpenses",
  async () => {
    // const response = await axios.get<Expenses[]>(EXPENSES_URLS);
    // const response = await axios.get<CompanyExpenses[]>(
    //   `${apiUrl}/sales_ai/company-expenses/`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${Cookies.get("accessToken")}`,
    //     },
    //   },
    // )
    // console.log('fetch expenses ', response.data)
    const response = await api.get<CompanyExpenses[]>(
      "/sales_ai/company-expenses/")
    return response.data // Return the fetched expenses data
  },
)

export const addNewExpense = createAsyncThunk(
  "companyExpense/addNewExpense",
  async ({ formData }: { formData: any }) => {
    // const response = await axios.post<CompanyExpenses>(
    //   `${apiUrl}/sales_ai/company-expenses/`,
    //   formData,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${Cookies.get("accessToken")}`,
    //     },
    //   },
    // )
    const response = await api.post("/sales_ai/company-expenses/", formData)
    return response.data // Return the created expense data
  },
)

export const updateCompanyExpense = createAsyncThunk(
  "companyExpenses/updateCompanyExpenseOwner",
  async ({ expenseId, formData }: { expenseId: string; formData: any }) => {
    // const response = await axios.patch(
    //   `${apiUrl}/sales_ai/company-expenses/${expenseId}/`,
    //   formData,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${Cookies.get("accessToken")}`,
    //     },
    //   },
    // )
    // console.log("Status functions", response.data)
    const response = await api.patch(
      `/sales_ai/company-expenses/${expenseId}/`,
      formData,
    );
    return response.data // Return the updated employee data
    // return { employeeId, statusField, updatedEmployee: response.data }; // Return the updated employee data
  },
)

export const deleteExpense = createAsyncThunk(
  "deleteExpenses/deleteExpense",
  async (deleteId: string) => {
    // const response = await axios.delete(
    //   `${apiUrl}/sales_ai/company-expenses/${deleteId}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${Cookies.get("accessToken")}`,
    //     },
    //   },
    // )
    const response = await api.delete(`/sales_ai/company-expenses/${deleteId}`);
    return response.data // Return the updated employee data
  },
)

const companyExpensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Fetch Expenses
      .addCase(fetchCompanyExpenses.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchCompanyExpenses.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.companyExpenses = action.payload
      })
      .addCase(fetchCompanyExpenses.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch expenses"
      })
      .addCase(addNewExpense.pending, (state) => {
        state.status = "loading"
      })
      .addCase(addNewExpense.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.companyExpenses = [action.payload, ...state.companyExpenses]
      })
      .addCase(addNewExpense.rejected, (state, action) => {
        state.status = "failed"
        state.error =
          action.error.message || "Failed to add the expense, try again."
      })

      .addCase(deleteExpense.pending, (state) => {
        state.status = "loading"
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.companyExpenses = state.companyExpenses.filter(
          (expense) => expense.id !== action.meta.arg,
        )
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to delete, try again."
      })

      .addCase(updateCompanyExpense.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCompanyExpense.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.companyExpenses.findIndex(
          (expense) => expense.id === action.payload.id,
        )
        if (index !== -1) {
          state.companyExpenses[index] = action.payload
        }
      })
      .addCase(updateCompanyExpense.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to update. Try again later."
      })
  },
})

export const selectAllCompanyExpenses = (state: {
  companyExpenses: CompanyExpensesState
}) => state.companyExpenses.companyExpenses
export const getCompanyExpensesStatus = (state: {
  companyExpenses: CompanyExpensesState
}) => state.companyExpenses.status
export const getCompanyExpensesError = (state: {
  companyExpenses: CompanyExpensesState
}) => state.companyExpenses.error

export default companyExpensesSlice.reducer
