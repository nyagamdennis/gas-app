/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import getApiUrl from "../../getApiUrl";
import Cookies from "cookies-js"

const apiUrl = getApiUrl()
const SALES_URLS = `${apiUrl}/sales/`;


interface OthersSales {
  id: number;
  total_amount: number;
  product: number;
  timestamp: string;
}

interface OthersSalesState {
    othersSales: OthersSales[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}


const initialState: OthersSalesState = {
    othersSales: [],
    status: "idle",
    error: null,
};

export const fetchOthersSales = createAsyncThunk<OthersSales[], void, {}>(
    "othersSales/fetchOthersSales",
    async () => {
      const response = await axios.get<OthersSales[]>(SALES_URLS);
      return response.data; // Corrected the return statement
    }
  );
  

export const recordOthersSales = createAsyncThunk(
  "othersSales/recordOthersSales",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${apiUrl}/recordOtherssales/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        // Use rejectWithValue to send backend errors to the `rejected` case
        return rejectWithValue(error.response.data);
      }
      throw error; // For other unexpected errors
    }
  }
);



const othersSalesSlice = createSlice({
  name: "othersSales",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchOthersSales.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOthersSales.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.othersSales = action.payload;
      })
      .addCase(fetchOthersSales.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch sales";
      })
      .addCase(recordOthersSales.pending, (state) => {
        state.status = "loading";
      })
      .addCase(recordOthersSales.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.othersSales = action.payload;
      })
      .addCase(recordOthersSales.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch sales";
      });
  },
});

export const selectAllSales = (state: { othersSales: OthersSalesState }) =>
  state.othersSales.othersSales;
export const getOthersSalestatus = (state: { othersSales: OthersSalesState }) =>
  state.othersSales.status;
export const getOthersSalesError = (state: { othersSales: OthersSalesState }) =>
  state.othersSales.error;

export default othersSalesSlice.reducer;
