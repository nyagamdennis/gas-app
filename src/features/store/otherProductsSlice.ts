// @ts-nocheck
/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../../utils/api"

type Status = "idle" | "loading" | "succeeded" | "failed"

interface otherProducts {
  id: string
  name: string
  whole_sales_price: number
  retail_sales_price: number
  quantity: number
  dates: string
  date_of_operation: string
}

interface otherProductsState {
  otherProducts: otherProducts[]
  status: Status
  error: string | null

  addNewProductStatus: Status
  addNewProductError: string | null | undefined

  updateOtherProductStatus: Status
  updateOtherProductError: string | null | undefined
}

const initialState: otherProductsState = {
  otherProducts: [],
  status: "idle",
  error: null,

  addNewProductStatus: "idle",
  addNewProductError: null,
  updateOtherProductStatus: "idle",
  updateOtherProductError: null,
}

export const fetchOtherProducts = createAsyncThunk<otherProducts[],{ businessId: string }, void, {}>(
  "otherProducts/fetchOtherProducts",
  async ({ businessId }) => {
    // await new Promise((resolve) => setTimeout(resolve, 5000))
    // const response = await axios.get<otherProducts[]>(`${apiUrl}/other-products/${businessId}/`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${Cookies.get("accessToken")}`,
    //     },
    //   }
    // )
    const response = await api.get<otherProducts[]>(`/other-products/${businessId}/`);
    return response.data
  },
)

export const addNewProduct = createAsyncThunk(
  "newProduct/addNewProduct",
  async ({businessId, formData}, { rejectWithValue }) => {
    try {
      // const response = await axios.post(`${apiUrl}/other-products/${businessId}/`, formData,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${Cookies.get("accessToken")}`,
      //     },
      //   }
      // )
      const response = await api.post(`/other-products/${businessId}/`, formData);
      return response.data
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.error) // extract `error` field
      }
      return rejectWithValue(err.message) // fallback error
    }
  },
)

export const updateOtherProduct = createAsyncThunk(
  "newProduct/updateOtherProduct",
  async ({ dat, id }: { dat: any; id: string }, thunkAPI) => {
    try {
      // const response = await axios.patch(`${PRODUCT_URLS}${id}/`, dat,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${Cookies.get("accessToken")}`,
      //     },
      //   }
      // )
      const response = await api.patch(`/other-products/${id}/`, dat);
      return response.data
    } catch (err: any) {
      if (err.response && err.response.data) {
        return thunkAPI.rejectWithValue(err.response.data.error)
      }
      return thunkAPI.rejectWithValue(err.message)
    }
  },
)

export const deleteOtherProduct = createAsyncThunk(
  "newProduct/deleteOtherProduct",
  async ({  id }: {  id: string }, thunkAPI) => {
    try {
      // const response = await axios.delete(`${PRODUCT_URLS}${id}/`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${Cookies.get("accessToken")}`,
      //     },
      //   }
      // )
      const response = await api.delete(`/other-products/${id}/`);
      return response.data
    } catch (err: any) {
      if (err.response && err.response.data) {
        return thunkAPI.rejectWithValue(err.response.data.error)
      }
      return thunkAPI.rejectWithValue(err.message)
    }
  },
)

const otherProductsSlice = createSlice({
  name: "otherProducts",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchOtherProducts.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchOtherProducts.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.otherProducts = action.payload
      })
      .addCase(fetchOtherProducts.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch products"
      })
      .addCase(addNewProduct.pending, (state) => {
        state.addNewProductStatus = "loading"
      })
      .addCase(addNewProduct.fulfilled, (state, action) => {
        state.addNewProductStatus = "succeeded"
        state.otherProducts = [...state.otherProducts, action.payload]
      })
      .addCase(addNewProduct.rejected, (state, action) => {
        state.addNewProductStatus = "failed"
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to add product"
      })

      .addCase(updateOtherProduct.pending, (state) => {
        state.updateOtherProductStatus = "loading"
      })
      .addCase(updateOtherProduct.fulfilled, (state, action) => {
        state.updateOtherProductStatus = "succeeded"
        state.otherProducts = state.otherProducts.map((product) =>
          product.id === action.payload.id ? action.payload : product,
        )
      })
      .addCase(updateOtherProduct.rejected, (state, action) => {
        state.updateOtherProductStatus = "failed"
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to add product"
      })

      .addCase(deleteOtherProduct.pending, (state) => {
        state.updateOtherProductStatus = "loading"
      })
      .addCase(deleteOtherProduct.fulfilled, (state, action) => {
        state.updateOtherProductStatus = "succeeded"
        state.otherProducts = state.otherProducts.filter(
          (product) => product.id !== action.meta.arg.id,
        )
      }
      )
      .addCase(deleteOtherProduct.rejected, (state, action) => {
        state.updateOtherProductStatus = "failed"
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to delete product"
      }
      )
  },
})

export const selectAllOtherProducts = (state: {
  otherProducts: otherProductsState
}) => state.otherProducts.otherProducts
export const getOtherProductstatus = (state: {
  otherProducts: otherProductsState
}) => state.otherProducts.status
export const getOtherProductsError = (state: {
  otherProducts: otherProductsState
}) => state.otherProducts.error

export default otherProductsSlice.reducer
