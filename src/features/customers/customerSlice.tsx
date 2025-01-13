/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import getApiUrl from "../../getApiUrl";

const apiUrl = getApiUrl()
const CUSTOMERS_URLS = `${apiUrl}/customer/`;


interface Customers {
  id: number;
  location: number[];
  name: string;
  phone: number;
  sales: string;
}

interface CustomersState {
  customers: Customers[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

interface FetchCustomersResponse {
  data: Customers[];
}

const initialState: CustomersState = {
  customers: [],
  status: "idle",
  error: null,
};

export const fetchCustomers = createAsyncThunk<Customers[], void, {}>(
    "customers/fetchCustomers",
    async () => {
      const response = await axios.get<Customers[]>(CUSTOMERS_URLS);
      return response.data; // Corrected the return statement
    }
  );
  

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch customers";
      });
  },
});

export const selectAllCustomers = (state: { customers: CustomersState }) =>
  state.customers.customers;
export const getCustomersStatus = (state: { customers: CustomersState }) =>
  state.customers.status;
export const getCustomerError = (state: { customers: CustomersState }) =>
  state.customers.error;

export default customersSlice.reducer;
