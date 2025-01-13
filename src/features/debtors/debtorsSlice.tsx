/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import getApiUrl from "../../getApiUrl";

const apiUrl = getApiUrl()
const DEBTORS_URLS = `${apiUrl}/debtors/`;


interface Debtors {
  id: number;
  location: number[];
  name: string;
  phone: number;
  sales: string;
}

interface DebtorsState {
    debtors: Debtors[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

interface FetchDebtorsResponse {
  data: Debtors[];
}

const initialState: DebtorsState = {
    debtors: [],
    status: "idle",
    error: null,
};

export const fetchDebtors = createAsyncThunk<Debtors[], void, {}>(
    "customers/fetchDebtors",
    async () => {
      const response = await axios.get<Debtors[]>(DEBTORS_URLS);
      return response.data; // Corrected the return statement
    }
  );
  

const debtorsSlice = createSlice({
  name: "debtors",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchDebtors.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDebtors.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.debtors = action.payload;
      })
      .addCase(fetchDebtors.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch customers";
      });
  },
});

export const selectAllDebtors = (state: { debtors: DebtorsState }) =>
  state.debtors.debtors;
export const getDebtorsStatus = (state: { debtors: DebtorsState }) =>
  state.debtors.status;
export const getDebtorsError = (state: { debtors: DebtorsState }) =>
  state.debtors.error;

export default debtorsSlice.reducer;
