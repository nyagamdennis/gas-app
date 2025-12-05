/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import api from "../../../utils/api"

// const CUSTOMERS_URLS = `${apiUrl}/customer/`;

interface Customers {
  id: number
  location: number[]
  name: string
  phone: number
  sales: string
}

interface CustomersState {
  customers: Customers[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

interface FetchCustomersResponse {
  data: Customers[]
}

const initialState: CustomersState = {
  customers: [],
  status: "idle",
  error: null,
}

export const fetchCustomers = createAsyncThunk<Customers[], void, {}>(
  "customers/fetchCustomers",
  async () => {
    // const response = await axios.get<Customers[]>(CUSTOMERS_URLS);
    const response = await api.get("/customer/")
    return response.data // Corrected the return statement
  },
)

export const addCustomer = createAsyncThunk<
  any,
  { name: string; phone: string; location: { name: string }; sales: string },
  { rejectValue: string }
>(
  "customers/addCustomer",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/customer/", formData);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        const data = error.response.data;

        // 🧠 Extract a clean message:
        let message = "Failed to add customer.";

        if (typeof data === "string") {
          message = data;
        } else if (data.error) {
          message = data.error;
        } else if (data.detail) {
          message = data.detail;
        } else if (Array.isArray(data)) {
          message = data.join(" ");
        } else if (typeof data === "object") {
          // For field-level errors like { phone: ["message"], location: ["message"] }
          const firstKey = Object.keys(data)[0];
          const firstValue = data[firstKey];
          if (Array.isArray(firstValue)) message = firstValue.join(" ");
          else if (typeof firstValue === "string") message = firstValue;
        }

        return rejectWithValue(message);
      }

      return rejectWithValue("Failed to add customer. Please try again.");
    }
  }
);

// export const addCustomer = createAsyncThunk<void, {}>(
//   "customers/addCustomer",
//   async() => {

//   }
// );

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.customers = action.payload
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch customers"
      })
      .addCase(addCustomer.pending, (state) => {
        state.status = "loading"
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.customers.push(action.payload)
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string || "Failed to create customer"
      })
  },
})

export const selectAllCustomers = (state: { customers: CustomersState }) =>
  state.customers.customers
export const getCustomersStatus = (state: { customers: CustomersState }) =>
  state.customers.status
export const getCustomerError = (state: { customers: CustomersState }) =>
  state.customers.error

export default customersSlice.reducer
