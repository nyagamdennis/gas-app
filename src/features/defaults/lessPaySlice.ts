/* eslint-disable prettier/prettier */
// @ts-nocheck
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "cookies-js"
import getApiUrl from "../../getApiUrl";

const apiUrl = getApiUrl();


interface LessPay {
  id: number;
  
}

interface LessPayState {
  lessPay: LessPay[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: LessPayState = {
  lessPay: [],
  status: "idle",
  error: null,
};

export const fetchLessPay = createAsyncThunk<LessPay[]>(
  "lessPay/fetchLessPay",
  async (employeeId) => {
    const response = await axios.get<LessPay[]>(`${apiUrl}/less-pay/${employeeId}`);
    return response.data; // Return the fetched employees data
  }
);



export const clearLessPay = createAsyncThunk(
  "lessPay/clearClearLessPay",
  async (lessPayId) => {
    const response = await axios.patch(`${apiUrl}/cylinder-less_pay/${lessPayId}/resolve/`);
    return response.data
  }
)




const lessPaySlice = createSlice({
  name: "lessPay",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Fetch Employees
      .addCase(fetchLessPay.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLessPay.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lessPay = action.payload;
      })
      .addCase(fetchLessPay.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch employees";
      })
      .addCase(clearLessPay.pending, (state) => {
        state.status = "loading";
      })
      .addCase(clearLessPay.fulfilled, (state, action) => {
        state.status = "succeeded";
        const removedId = action.meta.arg;
        // state.lessPay = action.payload;
        state.lessPay = state.lessPay.filter((item) => item.id !== removedId);
      })
      .addCase(clearLessPay.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch employees";
      })
  },
});

export const selectAllLessPay = (state: { lessPay: LessPayState }) => state.lessPay.lessPay;
export const getlessPayStatus = (state: { lessPay: LessPayState }) => state.lessPay.status;
export const getlessPayError = (state: { lessPay: LessPayState }) => state.lessPay.error;

export default lessPaySlice.reducer;
