/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import getApiUrl from "../../getApiUrl";
import Cookies from "cookies-js"

const apiUrl = getApiUrl()
const SALES_URLS = `${apiUrl}/sales/`;


interface Sales {
  id: number;
  total_amount: number;
  product: number;
  timestamp: string;
}

interface SalesState {
    sales: Sales[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

interface FetchSalesResponse {
  data: Sales[];
}

const initialState: SalesState = {
    sales: [],
    status: "idle",
    error: null,
};

export const fetchSales = createAsyncThunk<Sales[], void, {}>(
    "sales/fetchSales",
    async () => {
      const response = await axios.get<Sales[]>(SALES_URLS);
      return response.data; // Corrected the return statement
    }
  );
  

// export const recordSales = createAsyncThunk<Sales[], void, {}>(
//     "sales/recordSales",
//     async (formData) => {
//       // const response = await axios.post(`${apiUrl}/recordsales/`, formData,{
//       //   headers: {
//       //     Authorization: `Bearer ${Cookies.get("accessToken")}`,
//       //     "Content-Type": "application/json",
//       //   });
//       const response = await axios.post(
//         `${apiUrl}/recordsales/`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${Cookies.get("accessToken")}`,
//             "Content-Type": "application/json",
//           },
//         },
//       )
//       return response.data; // Corrected the return statement
//     }
//   );
  
export const recordSales = createAsyncThunk(
  "sales/recordSales",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${apiUrl}/recordsales/`,
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



const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchSales.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sales = action.payload;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch sales";
      })
      .addCase(recordSales.pending, (state) => {
        state.status = "loading";
      })
      .addCase(recordSales.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sales = action.payload;
      })
      .addCase(recordSales.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch sales";
      });
  },
});

export const selectAllSales = (state: { sales: SalesState }) =>
  state.sales.sales;
export const getSalestatus = (state: { sales: SalesState }) =>
  state.sales.status;
export const getSalesError = (state: { sales: SalesState }) =>
  state.sales.error;

export default salesSlice.reducer;
