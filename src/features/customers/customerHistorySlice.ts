/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import api from "../../../utils/api"

// const CUSTOMERS_URLS = `${apiUrl}/customer/`;

interface CustomersHistory {
  id: number
  location: number[]
  name: string
  phone: number
  sales: string
}
interface SaleItem {
    id: number
    product: {
        id: number
        name: string
    }
    quantity: number
    unit_price: string
    total_price: string
    created_at: string
}

interface CustomersHistory {
    id: number
    invoice_number: string
    sale_type: string
    payment_method: string
    payment_status: string
    total_amount: string
    amount_paid: string
    created_at: string
    items: SaleItem[]
    cylinder_items: any[]
}

interface CustomersHistoryState {
  customersHistory: CustomersHistory[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
  nextPage: string | null
  previousPage: string | null
  count: number
  currentPage: number
}

interface FetchCustomersHistoryResponse {
  data: CustomersHistory[]
}

const initialState: CustomersHistoryState = {
  customersHistory: [],
  status: "idle",
  error: null,
  nextPage: null,
  previousPage: null,
  count: 0,
  currentPage: 1,
}


export const fetchCustomersHistory = createAsyncThunk<
    any,
    { id: number; page?: number },
    { rejectValue: string }
>("customersHistory/fetchCustomersHistory", async ({ id, page = 1 }, { rejectWithValue }) => {
    try {
        const response = await api.get(`/sales/${id}/purchases/?page=${page}`)
        return response.data
    } catch (error: any) {
        return rejectWithValue("Failed to fetch customersHistory.")
    }
})



export const addCustomer = createAsyncThunk<
  any,
  { name: string; phone: string; location: { name: string }; sales: string },
  { rejectValue: string }
>(
  "customersHistory/addCustomer",
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
//   "customersHistory/addCustomer",
//   async() => {getCustomerError

//   }
// );

const customerHistorySlice = createSlice({
  name: "customersHistory",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCustomersHistory.pending, (state) => {
        state.status = "loading"
      })
     builder
       .addCase(fetchCustomersHistory.fulfilled, (state, action) => {
         state.status = "succeeded"
         state.customersHistory = action.payload.results
         state.nextPage = action.payload.next
         state.previousPage = action.payload.previous
         state.count = action.payload.count
       })

       .addCase(fetchCustomersHistory.rejected, (state, action) => {
         state.status = "failed"
         state.error = action.error.message || "Failed to fetch customersHistory"
       })
       .addCase(addCustomer.pending, (state) => {
         state.status = "loading"
       })
       .addCase(addCustomer.fulfilled, (state, action) => {
         state.status = "succeeded"
         state.customersHistory.push(action.payload)
       })
       .addCase(addCustomer.rejected, (state, action) => {
         state.status = "failed"
         state.error = (action.payload as string) || "Failed to create customer"
       })
  },
})

export const selectAllCustomersHistory = (state: { customersHistory: CustomersHistoryState }) =>
  state.customersHistory.customersHistory
export const getCustomersHistoryStatus = (state: { customersHistory: CustomersHistoryState }) =>
  state.customersHistory.status
export const getCustomerHistoryError = (state: { customersHistory: CustomersHistoryState }) =>
  state.customersHistory.error

export const selectHistoryPagination = (state: any) => ({
  next: state.customersHistory.next,
  previous: state.customersHistory.previous,
  count: state.customersHistory.count,
  currentPage: state.customersHistory.currentPage,
})


export default customerHistorySlice.reducer
