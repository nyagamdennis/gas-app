/* eslint-disable prettier/prettier */
// @ts-nocheck
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "cookies-js"
import getApiUrl from "../../getApiUrl";

const apiUrl = getApiUrl();


interface Advances {
  id: number;

}

interface AdvancesState {
  advances: Advances[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AdvancesState = {
  advances: [],
  status: "idle",
  error: null,
};

export const fetchAdvances = createAsyncThunk<Advances[]>(
  "advances/fetchAdvances",
  async (employeeId) => {
    const response = await axios.get<Advances[]>(`${apiUrl}/advances/${employeeId}`);
    return response.data; // Return the fetched employees data
  }
);

export const clearAdvances = createAsyncThunk(
  "advances/clearAdvances",
  async (advanceId) => {
    const response = await axios.patch(`${apiUrl}/clear-advances/${advanceId}/resolve/`);
   
    return response.data
  }
)



export const addEmployeeAdvance = createAsyncThunk(
  "advances/addEmployeeAdvance",
  async ({ employeeId, amount, date_issued }: { employeeId: number; amount: number, date_issued: string }) => {
      const formData = { amount: amount, date_issued: date_issued, employee: employeeId };
      const response = await axios.post(`${apiUrl}/advances/${employeeId}/`, formData,
          {
              headers: {
                  Authorization: `Bearer ${Cookies.get("accessToken")}`,
              },
          }
      );
      console.log('response ', response.data)
      return response.data;
  }
);




const advancesSlice = createSlice({
  name: "advances",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Fetch Employees
      .addCase(fetchAdvances.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAdvances.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.advances = action.payload;
      })
      .addCase(fetchAdvances.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch employees";
      })
      .addCase(clearAdvances.pending, (state) => {
        state.status = "loading";
      })
      .addCase(clearAdvances.fulfilled, (state, action) => {
        state.status = "succeeded";
        const removedId = action.meta.arg; // Get the defaultId that was cleared
        state.advances = state.advances.filter((item) => item.id !== removedId);
       
      })
      .addCase(clearAdvances.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch employees";
      })


      .addCase(addEmployeeAdvance.pending, (state) => {
        state.status = "loading";
    })

    .addCase(addEmployeeAdvance.fulfilled, (state, action) => {
        state.status = "succeeded";

        // Extract updated employee from the payload
        const updatedAdvance = action.payload;
        state.advances = [...state.advances, updatedAdvance];
        
    })

    .addCase(addEmployeeAdvance.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to add salary.";
    })
     
  },
});

export const selectAllAdvance = (state: { advances: AdvancesState }) => state.advances.advances;
export const getAdvancesStatus = (state: { advances: AdvancesState }) => state.advances.status;
export const getAdvancesError = (state: { advances: AdvancesState }) => state.advances.error;

export default advancesSlice.reducer;
