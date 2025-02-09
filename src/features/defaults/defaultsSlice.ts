/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "cookies-js"
import getApiUrl from "../../getApiUrl";

const apiUrl = getApiUrl();


interface Defaults {
  id: number;
  
}

interface DefaultsState {
  defaults: Defaults[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: DefaultsState = {
  defaults: [],
  status: "idle",
  error: null,
};

export const fetchDefaults = createAsyncThunk<Defaults[]>(
  "defaults/fetchDefaults",
  async (employeeId) => {
    const response = await axios.get<Defaults[]>(`${apiUrl}/defaults/${employeeId}`);
    return response.data; // Return the fetched employees data
  }
);

export const clearDefault = createAsyncThunk(
  "defaults/clearDefault",
  async (defaultId) => {
    const response = await axios.patch(`${apiUrl}/cylinder-lost/${defaultId}/resolve/`);
    return response.data
  }
)

const defaultsSlice = createSlice({
  name: "defaults",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Fetch Employees
      .addCase(fetchDefaults.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDefaults.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.defaults = action.payload;
      })
      .addCase(fetchDefaults.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch employees";
      })
      .addCase(clearDefault.pending, (state) => {
        state.status = "loading";
      })
      .addCase(clearDefault.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.defaults = action.payload;
      })
      .addCase(clearDefault.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch employees";
      })
      // Transfer Employee
    
  },
});

export const selectAllDefaults = (state: { defaults: DefaultsState }) => state.defaults.defaults;
export const getDefaultsStatus = (state: { defaults: DefaultsState }) => state.defaults.status;
export const getDefaultsError = (state: { defaults: DefaultsState }) => state.defaults.error;

export default defaultsSlice.reducer;
