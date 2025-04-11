/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "cookies-js"
import getApiUrl from "../../getApiUrl";

const apiUrl = getApiUrl();
const EXPENSES_URLS = `${apiUrl}/expenses/`;

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
  teamExpenses: Expenses[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ExpensesState = {
  teamExpenses: [],
  status: "idle",
  error: null,
};



export const fetchTeamExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async ({salesTeamId}:{salesTeamId: string}) => {
    // const response = await axios.get<Expenses[]>(EXPENSES_URLS);
    console.log('id team ', salesTeamId)
    const response = await axios.get(`${apiUrl}/team-expenses/${salesTeamId}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }
    );
    return response.data; // Return the fetched expenses data
  }
);



export const postExpenses = createAsyncThunk(
  "expenses/postExpenses",
  async ({employeeId,salesTeamId,  expenseName, expenseAmount}: {employeeId: string; salesTeamId: string; expenseName: string; expenseAmount: number}) => {
     const formData = {
          name: expenseName,
          amount: expenseAmount,
          sales_team: salesTeamId,
        }
        console.log('data sent ', formData)
    const response = await axios.post(`${apiUrl}/expenses/${employeeId}/`, formData,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }
    );
    return response.data; // Return the fetched expenses data
  }
);




export const updateExpensesStatus = createAsyncThunk(
  "expenses/updateExpensesStatus",
  async ({ employeeId, statusField }: { employeeId: number; statusField: string }) => {
    const response = await axios.patch(`${apiUrl}/update-expense/${employeeId}/`, {
      status_field: statusField,
    },{
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    });
    console.log('STatus functions', response.data)
    return response.data; // Return the updated employee data
    // return { employeeId, statusField, updatedEmployee: response.data }; // Return the updated employee data
  }
);

const teamExpensesSlice = createSlice({
  name: "teamExpenses",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder

      .addCase(fetchTeamExpenses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTeamExpenses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.teamExpenses = action.payload;
      })
      .addCase(fetchTeamExpenses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch expenses";
      })

      .addCase(postExpenses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(postExpenses.fulfilled, (state, action) => {
        state.status = "succeeded";
        // state.expenses = action.payload;
        state.teamExpenses.push(action.payload);
      })
      .addCase(postExpenses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch expenses";
      })
      // Transfer Employee
      
      .addCase(updateExpensesStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
    
        // Extract updated employee from the payload
        const updatedEmployee = action.payload.employee;
    
        // Update the expenses array with the modified employee
        state.teamExpenses = state.teamExpenses.map((employee) =>
            employee.id === updatedEmployee.id ? updatedEmployee : employee
        );
    })
    
    
      .addCase(updateExpensesStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to update employee status";
      });
  },
});

export const selectAllTeamExpenses = (state: { teamExpenses: ExpensesState }) => state.teamExpenses.teamExpenses;
export const getTeamExpensesStatus = (state: { teamExpenses: ExpensesState }) => state.teamExpenses.status;
export const getTeamExpensesError = (state: { teamExpenses: ExpensesState }) => state.teamExpenses.error;

export default teamExpensesSlice.reducer;
