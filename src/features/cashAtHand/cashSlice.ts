/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "cookies-js"
import getApiUrl from "../../getApiUrl";

const apiUrl = getApiUrl();

interface Cash {
  id: number;
  
}

interface CashState {
  cash: Cash[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CashState = {
  cash: [],
  status: "idle",
  error: null,
};

export const fetchCash = createAsyncThunk<Cash[]>(
  "cash/fetchCash",
  async () => {
    // const response = await axios.get<cash[]>(cash_URLS);
    const response = await axios.get<Cash[]>(`${apiUrl}/cash/`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }
    );
    return response.data; // Return the fetched cash data
  }
);


export const postCash = createAsyncThunk(
  "cash/postCash",
  async ({selectedEmployeeId, totalDefaultCash, cashAtHand, salesTeamId, endDate}:{selectedEmployeeId: string; totalDefaultCash: string; cashAtHand: number; salesTeamId:string; endDate:string;}) => {
    // const response = await axios.get<cash[]>(cash_URLS);
    const formData = {
      cash_default: totalDefaultCash,
      cash_at_hand: cashAtHand,
      sales_team: salesTeamId,
      date: endDate,
    }
    const response = await axios.post(`${apiUrl}/cash/${selectedEmployeeId}/`,formData,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }
    );
    return response.data; // Return the fetched cash data
  }
);



export const updateCashStatus = createAsyncThunk(
  "cash/updateCashStatus",
  async ({ employeeId, statusField }: { employeeId: number; statusField: string }) => {
    const response = await axios.patch(`${apiUrl}/update-expense/${employeeId}/`, {
      status_field: statusField,
    },{
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    });
    return response.data; // Return the updated employee data
    // return { employeeId, statusField, updatedEmployee: response.data }; // Return the updated employee data
  }
);

const cashSlice = createSlice({
  name: "cash",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Fetch cash
      .addCase(fetchCash.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCash.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cash = action.payload;
      })
      .addCase(fetchCash.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch cash";
      })
      .addCase(postCash.pending, (state) => {
        state.status = "loading";
      })
      .addCase(postCash.fulfilled, (state, action) => {
        state.status = "succeeded";
        // state.cash = action.payload;

        state.cash = {
          ...state.cash,
          ...action.payload, // ✅ merges updated values
        };
      })
      .addCase(postCash.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch cash";
      })
      // Transfer Employee
      
      .addCase(updateCashStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Extract updated employee from the payload
        const updatedEmployee = action.payload.employee;
        // Update the cash array with the modified employee
        state.cash = state.cash.map((employee) =>
            employee.id === updatedEmployee.id ? updatedEmployee : employee
        );
    })
    
    
      .addCase(updateCashStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to update employee status";
      });
  },
});

export const selectAllCash = (state: { cash: CashState }) => state.cash.cash;
export const getCashStatus = (state: { cash: CashState }) => state.cash.status;
export const getCashError = (state: { cash: CashState }) => state.cash.error;

export default cashSlice.reducer;
