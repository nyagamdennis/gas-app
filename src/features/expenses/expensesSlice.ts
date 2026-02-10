// @ts-nocheck
/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../../utils/api"

// Interfaces based on backend models
interface ExpenseCategory {
  id: number
  name: string
  description?: string
  code: string
  is_active: boolean
}

interface ExpenseSubCategory {
  id: number
  name: string
  description?: string
  category: number
  category_name?: string
}

interface Expense {
  id: number
  company: number
  expense_type:
    | "VEHICLE"
    | "MOTORBIKE"
    | "SHOP"
    | "STORE"
    | "OFFICE"
    | "STAFF"
    | "UTILITY"
    | "MARKETING"
    | "MAINTENANCE"
    | "OTHER"
  category: ExpenseCategory
  subcategory: ExpenseSubCategory | null
  title: string
  description: string
  amount: string
  tax_amount: string
  total_amount: string
  payment_method: "CASH" | "MPESA" | "BANK_TRANSFER" | "CHEQUE" | "CREDIT_CARD"
  payment_reference?: string
  payment_date?: string
  location?: number
  vehicle?: number
  motorbike?: number
  expense_date: string
  status: "PENDING" | "APPROVED" | "REJECTED" | "PAID"
  receipt_number?: string
  entered_by: number
  entered_by_name?: string
  approved_by?: number
  approved_by_name?: string
  approved_at?: string
  rejection_reason?: string
  notes?: string
  created_at: string
  updated_at: string
}

interface ExpenseSummary {
  summary: {
    total_amount: number
    total_tax: number
    count: number
    average_amount: number
    pending_count: number
    approved_count: number
    paid_count: number
    rejected_count: number
  }
  category_breakdown: Array<{
    category__name: string
    total: number
    count: number
  }>
  type_breakdown: Array<{
    expense_type: string
    total: number
    count: number
  }>
  location_breakdown: Array<{
    location__name: string
    total: number
    count: number
  }>
  status_breakdown: Array<{
    status: string
    total: number
    count: number
  }>
  period: {
    start_date: string
    end_date: string
  }
}

interface ExpensesState {
  expenses: Expense[]
  categories: ExpenseCategory[]
  subcategories: ExpenseSubCategory[]
  summary: ExpenseSummary | null
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

// Add these interfaces if not already present
interface Employee {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  department?: string
  position?: string
  salary?: number
}

interface ExpenseAttachmentToEmployee {
  id: number
  expense: number
  employee: Employee
  deduction_amount: number
  status: "PENDING" | "APPROVED" | "DEDUCTED"
  created_at: string
}

// Update your ExpensesState interface to include employees
interface ExpensesState {
  expenses: Expense[]
  categories: ExpenseCategory[]
  subcategories: ExpenseSubCategory[]
  summary: ExpenseSummary | null
  employees: Employee[] // Add this
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

// Update initialState
const initialState: ExpensesState = {
  expenses: [],
  categories: [],
  subcategories: [],
  summary: null,
  employees: [], // Add this
  status: "idle",
  error: null,
}

export const attachExpenseToEmployee = createAsyncThunk(
  "expenses/attachExpenseToEmployee",
  async ({
    expenseId,
    employeeId,
    deductionAmount,
    description,
  }: {
    expenseId: number
    employeeId: number
    deductionAmount: number
    description?: string
  }) => {
    const response = await api.post(
      `/expenses/expenses/${expenseId}/attach_to_employee/`,
      {
        employee_id: employeeId,
        deduction_amount: deductionAmount,
        description: description || "",
      },
    )
    return response.data
  },
)


type FetchExpensesParams = {
  shopId?: number
  storeId?: number
  vehicleId?: number
}

// Get employees for expense attachment
export const fetchEmployeesForExpense = createAsyncThunk(
  "expenses/fetchEmployeesForExpense",
  async () => {
    const response = await api.get("/employees/") // Adjust endpoint based on your employee API
    return response.data
  },
)
// Fetch all expenses (with optional query parameters)
export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async (params?: {
    start_date?: string
    end_date?: string
    category?: string
    status?: string
  }) => {
    const response = await api.get("/expenses/expenses/", { params })
    return response.data
  },
)

export const fetchTeamExpenses = createAsyncThunk<
  Expense[],
  FetchExpensesParams | undefined
>("sales/fetchTeamExpenses", async (params, { rejectWithValue }) => {
  try {
    const response = await api.get("/expenses/expenses/", {
      params: {
        ...(params?.date && { created_at__date: params.date }),
        ...(params?.startDate && { created_at__date__gte: params.startDate }),
        ...(params?.endDate && { created_at__date__lte: params.endDate }),
        ...(params?.shopId && { shop: params.shopId }),
        ...(params?.storeId && { store: params.storeId }),
        ...(params?.vehicleId && { vehicle: params.vehicleId }),
      },
    })
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data)
  }
})





// Fetch expense categories
export const fetchExpenseCategories = createAsyncThunk(
  "expenses/fetchExpenseCategories",
  async () => {
    const response = await api.get("/expenses/categories/")
    return response.data
  },
)

// Fetch expense subcategories (optionally filtered by category)
export const fetchExpenseSubCategories = createAsyncThunk(
  "expenses/fetchExpenseSubCategories",
  async (categoryId?: number) => {
    const params = categoryId ? { category: categoryId } : {}
    const response = await api.get("/expenses/subcategories/", { params })
    return response.data
  },
)

// Fetch expense summary
export const fetchExpenseSummary = createAsyncThunk(
  "expenses/fetchExpenseSummary",
  async (params?: { start_date?: string; end_date?: string }) => {
    const response = await api.get("/expenses/summary/", { params })
    return response.data
  },
)

// Create new expense
export const createExpense = createAsyncThunk(
  "expenses/createExpense",
  async (expenseData: FormData) => {
    const response = await api.post("/expenses/expenses/", expenseData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },
)

// Update expense
export const updateExpense = createAsyncThunk(
  "expenses/updateExpense",
  async ({
    id,
    expenseData,
  }: {
    id: number
    expenseData: Partial<Expense>
  }) => {
    const response = await api.patch(`/expenses/expenses/${id}/`, expenseData)
    return response.data
  },
)

// Delete expense
export const deleteExpense = createAsyncThunk(
  "expenses/deleteExpense",
  async (id: number) => {
    await api.delete(`/expenses/${id}/`)
    return id
  },
)

// Approve expense
export const approveExpense = createAsyncThunk(
  "expenses/approveExpense",
  async (id: number) => {
    const response = await api.post(`/expenses/expenses/${id}/approve/`)
    return response.data
  },
)

// Reject expense
export const rejectExpense = createAsyncThunk(
  "expenses/rejectExpense",
  async ({
    id,
    rejection_reason,
  }: {
    id: number
    rejection_reason: string
  }) => {
    const response = await api.post(`/expenses/expenses/${id}/reject/`, {
      rejection_reason,
    })
    return response.data
  },
)

// Mark expense as paid
export const markExpenseAsPaid = createAsyncThunk(
  "expenses/markExpenseAsPaid",
  async (id: number) => {
    const response = await api.post(`/expenses/expenses/${id}/mark_paid/`)
    return response.data
  },
)

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch expenses
      .addCase(fetchExpenses.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.expenses = action.payload
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch expenses"
      })

      // Fetch categories
      .addCase(fetchExpenseCategories.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchExpenseCategories.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.categories = action.payload
      })
      .addCase(fetchExpenseCategories.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch categories"
      })

      // Fetch subcategories
      .addCase(fetchExpenseSubCategories.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchExpenseSubCategories.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.subcategories = action.payload
      })
      .addCase(fetchExpenseSubCategories.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch subcategories"
      })

      // Fetch summary
      .addCase(fetchExpenseSummary.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchExpenseSummary.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.summary = action.payload
      })
      .addCase(fetchExpenseSummary.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch summary"
      })

      // Create expense
      .addCase(createExpense.pending, (state) => {
        state.status = "loading"
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.expenses.unshift(action.payload)
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to create expense"
      })

      // Update expense
      .addCase(updateExpense.pending, (state) => {
        state.status = "loading"
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.status = "succeeded"
        const index = state.expenses.findIndex(
          (expense) => expense.id === action.payload.id,
        )
        if (index !== -1) {
          state.expenses[index] = action.payload
        }
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to update expense"
      })

      // Delete expense
      .addCase(deleteExpense.pending, (state) => {
        state.status = "loading"
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.expenses = state.expenses.filter(
          (expense) => expense.id !== action.payload,
        )
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to delete expense"
      })

      // Approve expense
      .addCase(approveExpense.pending, (state) => {
        state.status = "loading"
      })
      .addCase(approveExpense.fulfilled, (state, action) => {
        state.status = "succeeded"
        const index = state.expenses.findIndex(
          (expense) => expense.id === action.payload.id,
        )
        if (index !== -1) {
          state.expenses[index] = action.payload
        }
      })

      // Reject expense
      .addCase(rejectExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(
          (expense) => expense.id === action.payload.id,
        )
        if (index !== -1) {
          state.expenses[index] = action.payload
        }
      })

      // Mark as paid
      .addCase(markExpenseAsPaid.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(
          (expense) => expense.id === action.payload.id,
        )
        if (index !== -1) {
          state.expenses[index] = action.payload
        }
      })

      .addCase(attachExpenseToEmployee.pending, (state) => {
        state.status = "loading"
      })
      .addCase(attachExpenseToEmployee.fulfilled, (state, action) => {
        state.status = "succeeded"
        // Update the expense in the state with the new attachment
        const expenseId = action.meta.arg.expenseId
        const index = state.expenses.findIndex(
          (expense) => expense.id === expenseId,
        )
        if (index !== -1) {
          // You might want to fetch the updated expense from the server
          // or update local state with the attachment data
          state.expenses[index] = {
            ...state.expenses[index],
            // Add the attachment to the expense
            employee_attachments: [
              ...(state.expenses[index].employee_attachments || []),
              action.payload.attachment,
            ],
          }
        }
      })
      .addCase(attachExpenseToEmployee.rejected, (state, action) => {
        state.status = "failed"
        state.error =
          action.error.message || "Failed to attach expense to employee"
      })

      .addCase(fetchEmployeesForExpense.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchEmployeesForExpense.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.employees = action.payload
      })
      .addCase(fetchEmployeesForExpense.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch employees"
      })
  },
})

export const selectAllExpenses = (state: { expenses: ExpensesState }) =>
  state.expenses.expenses
export const selectExpenseCategories = (state: { expenses: ExpensesState }) =>
  state.expenses.categories
export const selectExpenseSubCategories = (state: {
  expenses: ExpensesState
}) => state.expenses.subcategories
export const selectExpenseSummary = (state: { expenses: ExpensesState }) =>
  state.expenses.summary
export const getExpensesStatus = (state: { expenses: ExpensesState }) =>
  state.expenses.status
export const getExpensesError = (state: { expenses: ExpensesState }) =>
  state.expenses.error

export const selectAllEmployees = (state: { expenses: ExpensesState }) =>
  state.expenses.employees
export default expensesSlice.reducer
