/* eslint-disable prettier/prettier */
import { compose, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../utils/api"



interface Expenses {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  alternative_phone: string;
  sales_team?: { id: number; name: string };
  verified: boolean;
  suspended: boolean;
  fired: boolean;
  defaulted: boolean;
}

interface ExpensesState {
  expenses: Expenses[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ExpensesState = {
  expenses: [],
  status: "idle",
  error: null,
};

export const fetchExpenses = createAsyncThunk<Expenses[]>(
  "expenses/fetchExpenses",
  async (employeeId) => {
    // const response = await axios.get<Expenses[]>(EXPENSES_URLS);
    // const response = await axios.get<Expenses[]>(`${apiUrl}/expenses/${employeeId}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${Cookies.get("accessToken")}`,
    //     },
    //   }
    // );
    // console.log('fetch expenses ', response.data)
    const response = await api.get<Expenses[]>(`/expenses/${employeeId}`);
    return response.data; // Return the fetched expenses data
  }
);




export const updateExpensesStatus = createAsyncThunk(
  "expenses/updateExpensesStatus",
  async ({ employeeId, statusField }: { employeeId: number; statusField: string }) => {
    // const response = await axios.patch(`${apiUrl}/update-expense/${employeeId}/`, {
    //   status_field: statusField,
    // },{
    //   headers: {
    //     Authorization: `Bearer ${Cookies.get("accessToken")}`,
    //   },
    // });
    // console.log('STatus functions', response.data)
    const response = await api.patch(`/update-expense/${employeeId}/`, {
      status_field: statusField,
    });
    return response.data; // Return the updated employee data
    // return { employeeId, statusField, updatedEmployee: response.data }; // Return the updated employee data
  }
);


export const updateExpenseOwner = createAsyncThunk(
  "expenses/updateExpenseOwner",
  async ({ expenseId, selectedOwner}: { expenseId: string; selectedOwner: string}) => {
    // const response = await axios.post(`${apiUrl}/update-owner-expense/${expenseId}/`, {
    //   owner: selectedOwner
    // },{
    //   headers: {
    //     Authorization: `Bearer ${Cookies.get("accessToken")}`,
    //   },
    // });
    // console.log('Status functions', response.data)
    const response = await api.post(`/update-owner-expense/${expenseId}/`, {
      owner: selectedOwner,
    });
    return response.data; // Return the updated employee data
    // return { employeeId, statusField, updatedEmployee: response.data }; // Return the updated employee data
  }
);


const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Fetch Expenses
      .addCase(fetchExpenses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch expenses";
      })
      .addCase(updateExpensesStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateExpensesStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
    
        // Extract updated employee from the payload
        const updatedEmployee = action.payload.employee;
    
        // Update the expenses array with the modified employee
        state.expenses = state.expenses.map((employee) =>
            employee.id === updatedEmployee.id ? updatedEmployee : employee
        );
    })
      .addCase(updateExpensesStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to update employee status";
      })

      .addCase(updateExpenseOwner.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateExpenseOwner.fulfilled, (state, action) => {
        state.status = "succeeded";
    
        // Extract updated employee from the payload
        const updatedEmployee = action.payload.employee;
        // Update the expenses array with the modified employee
        state.expenses = state.expenses.map((employee) =>
            employee.id === updatedEmployee.id ? updatedEmployee : employee
        );
    })
      .addCase(updateExpenseOwner.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to update employee status";
      })


      
  },
});

export const selectAllExpenses = (state: { expenses: ExpensesState }) => state.expenses.expenses;
export const getExpensesStatus = (state: { expenses: ExpensesState }) => state.expenses.status;
export const getExpensesError = (state: { expenses: ExpensesState }) => state.expenses.error;

export default expensesSlice.reducer;
