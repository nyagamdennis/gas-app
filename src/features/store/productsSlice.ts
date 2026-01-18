// @ts-nocheck
/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../../utils/api"

type Status = "idle" | "loading" | "succeeded" | "failed"

interface Product {
  id: number
  store: number
  store_name: string
  product: {
    id: number
    name: string
    date_of_operation: string
    quantity: number
    prices: any
  }
  quantity: number
  spoiled_product_quantity: number
  created_at: string
  updated_at: string
}

interface ProductsState {
  products: Product[] // Changed from Products to products (lowercase)
  status: Status
  error: string | null

  addNewProductStatus: Status
  addNewProductError: string | null | undefined

  updateOtherProductStatus: Status
  updateOtherProductError: string | null | undefined

  deleteOtherProductStatus: Status
  deleteOtherProductError: string | null | undefined
}

const initialState: ProductsState = {
  products: [], // Changed from Products to products (lowercase)
  status: "idle",
  error: null,

  addNewProductStatus: "idle",
  addNewProductError: null,
  updateOtherProductStatus: "idle",
  updateOtherProductError: null,
  deleteOtherProductStatus: "idle",
  deleteOtherProductError: null,
}

export const fetchOtherProducts = createAsyncThunk(
  "products/fetchOtherProducts", // Changed from Products to products
  async ({ storeId }: { storeId: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/inventory/stores/${storeId}/products/`)
      console.log("fetched other products response ", response.data)
      return response.data
    } catch (err: any) {
      console.error("Error fetching products:", err)
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.error || err.response.data)
      }
      return rejectWithValue(err.message)
    }
  },
)

export const addNewProduct = createAsyncThunk(
  "products/addNewProduct",
  async (
    { storeId, formData }: { storeId: string; formData: any },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post(
        `/inventory/stores/${storeId}/products/`,
        formData,
      )
      return response.data
    } catch (err: any) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.error || err.response.data)
      }
      return rejectWithValue(err.message)
    }
  },
)

export const updateOtherProduct = createAsyncThunk(
  "products/updateOtherProduct",
  async (
    { dat, id }: { dat: any; id: number | string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.patch(`/inventory/store-products/${id}/`, dat)
      return response.data
    } catch (err: any) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.error || err.response.data)
      }
      return rejectWithValue(err.message)
    }
  },
)

export const deleteOtherProduct = createAsyncThunk(
  "products/deleteOtherProduct",
  async ({ id }: { id: number | string }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/inventory/store-products/${id}/`)
      return { id, ...response.data }
    } catch (err: any) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.error || err.response.data)
      }
      return rejectWithValue(err.message)
    }
  },
)

const productsSlice = createSlice({
  // Changed from ProductsSlice to productsSlice
  name: "products", // Changed from Products to products - THIS IS CRITICAL
  initialState,
  reducers: {
    resetProductsState: (state) => {
      state.products = []
      state.status = "idle"
      state.error = null
    },
  },
  extraReducers(builder) {
    builder
      // Fetch Other Products
      .addCase(fetchOtherProducts.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchOtherProducts.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.products = action.payload // Changed from Products to products
        state.error = null
      })
      .addCase(fetchOtherProducts.rejected, (state, action) => {
        state.status = "failed"
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to fetch products"
      })

      // Add New Product
      .addCase(addNewProduct.pending, (state) => {
        state.addNewProductStatus = "loading"
        state.addNewProductError = null
      })
      .addCase(addNewProduct.fulfilled, (state, action) => {
        state.addNewProductStatus = "succeeded"
        state.products = [...state.products, action.payload] // Changed from Products to products
        state.addNewProductError = null
      })
      .addCase(addNewProduct.rejected, (state, action) => {
        state.addNewProductStatus = "failed"
        state.addNewProductError =
          (action.payload as string) ||
          action.error.message ||
          "Failed to add product"
      })

      // Update Other Product
      .addCase(updateOtherProduct.pending, (state) => {
        state.updateOtherProductStatus = "loading"
        state.updateOtherProductError = null
      })
      .addCase(updateOtherProduct.fulfilled, (state, action) => {
        state.updateOtherProductStatus = "succeeded"
        state.products = state.products.map(
          (
            product, // Changed from Products to products
          ) => (product.id === action.payload.id ? action.payload : product),
        )
        state.updateOtherProductError = null
      })
      .addCase(updateOtherProduct.rejected, (state, action) => {
        state.updateOtherProductStatus = "failed"
        state.updateOtherProductError =
          (action.payload as string) ||
          action.error.message ||
          "Failed to update product"
      })

      // Delete Other Product
      .addCase(deleteOtherProduct.pending, (state) => {
        state.deleteOtherProductStatus = "loading"
        state.deleteOtherProductError = null
      })
      .addCase(deleteOtherProduct.fulfilled, (state, action) => {
        state.deleteOtherProductStatus = "succeeded"
        state.products = state.products.filter(
          // Changed from Products to products
          (product) => product.id !== action.payload.id,
        )
        state.deleteOtherProductError = null
      })
      .addCase(deleteOtherProduct.rejected, (state, action) => {
        state.deleteOtherProductStatus = "failed"
        state.deleteOtherProductError =
          (action.payload as string) ||
          action.error.message ||
          "Failed to delete product"
      })
  },
})

// Export actions
export const { resetProductsState } = productsSlice.actions

// Selectors - FIXED TO MATCH THE SLICE NAME
export const selectAllOtherProducts = (state: any) => state.products.products
export const getOtherProductsStatus = (state: any) => state.products.status
export const getOtherProductsError = (state: any) => state.products.error

export const getAddProductStatus = (state: any) =>
  state.products.addNewProductStatus
export const getAddProductError = (state: any) =>
  state.products.addNewProductError

export const getUpdateProductStatus = (state: any) =>
  state.products.updateOtherProductStatus
export const getUpdateProductError = (state: any) =>
  state.products.updateOtherProductError

export const getDeleteProductStatus = (state: any) =>
  state.products.deleteOtherProductStatus
export const getDeleteProductError = (state: any) =>
  state.products.deleteOtherProductError

export default productsSlice.reducer // Changed from ProductsSlice to productsSlice
