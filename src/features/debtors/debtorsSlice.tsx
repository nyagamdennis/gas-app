/* eslint-disable prettier/prettier */
// @ts-nocheck
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import getApiUrl from "../../getApiUrl";

const apiUrl = getApiUrl();
const DEBTORS_URL = `${apiUrl}/debtors/`;

type Status = "idle" | "loading" | "succeeded" | "failed";

interface Debtors {
  id: number;
  location: number[];
  name: string;
  phone: number;
  sales: string;
}

interface DebtorsState {
  debtors: Debtors[];
  status: Status;
  error: string | null;

  clearDebtStatus: Status;
  clearDebtError: string | null;
}

const initialState: DebtorsState = {
  debtors: [],
  status: "idle",
  error: null,
  clearDebtStatus: "idle",
  clearDebtError: null,
};

export const fetchDebtors = createAsyncThunk<Debtors[], void>(
  "debtors/fetchDebtors",
  async () => {
    const response = await axios.get<Debtors[]>(DEBTORS_URL);
    return response.data;
  }
);

export const clearDebtors = createAsyncThunk<void, number>(
  "debtors/clearDebtors",
  async (pk) => {
    await axios.post(`${apiUrl}/clear_debt/${pk}/`);
    return pk;
  }
);

const debtorsSlice = createSlice({
  name: "debtors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Debtors Cases
      .addCase(fetchDebtors.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDebtors.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.debtors = action.payload;
      })
      .addCase(fetchDebtors.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch debtors.";
      })

      // Clear Debtors Cases
      .addCase(clearDebtors.pending, (state) => {
        state.clearDebtStatus = "loading";
        state.clearDebtError = null;
      })
      .addCase(clearDebtors.fulfilled, (state, action) => {
        state.clearDebtStatus = "succeeded";
        const clearedDebtorId = action.payload;
        state.debtors = state.debtors.filter(
          (debtor) => debtor.id !== clearedDebtorId
        );
      })
      .addCase(clearDebtors.rejected, (state, action) => {
        state.clearDebtStatus = "failed";
        state.clearDebtError =
          action.error.message || "Failed to clear the selected debt.";
      });
  },
});

export const selectAllDebtors = (state: { debtors: DebtorsState }) =>
  state.debtors.debtors;
export const getDebtorsStatus = (state: { debtors: DebtorsState }) =>
  state.debtors.status;
export const getDebtorsError = (state: { debtors: DebtorsState }) =>
  state.debtors.error;
export const getClearDebtStatus = (state: { debtors: DebtorsState }) =>
  state.debtors.clearDebtStatus;
export const getClearDebtError = (state: { debtors: DebtorsState }) =>
  state.debtors.clearDebtError;

export default debtorsSlice.reducer;
