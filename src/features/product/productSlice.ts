/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import getApiUrl from "../../getApiUrl";

const apiUrl = getApiUrl()
const PRODUCT_URLS = `${apiUrl}/products/`;


interface Products {
  id: number;
  name: string;
  weight: {
    id: number;
    weight: number;
  };
  gas_type:{
    id: number;
    name: string;
  }
}

interface ProductsState {
    products: Products[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

interface FetchProductsResponse {
  data: Products[];
}

const initialState: ProductsState = {
    products: [],
    status: "idle",
    error: null,
};

export const fetchProducts = createAsyncThunk<Products[], void, {}>(
    "customers/fetchProducts",
    async () => {
      const response = await axios.get<Products[]>(PRODUCT_URLS);
      return response.data; // Corrected the return statement
    }
  );
  

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch products";
      });
  },
});

export const selectAllProducts = (state: { products: ProductsState }) =>
  state.products.products;
export const getProductstatus = (state: { products: ProductsState }) =>
  state.products.status;
export const getDebtorsError = (state: { products: ProductsState }) =>
  state.products.error;

export default productsSlice.reducer;
