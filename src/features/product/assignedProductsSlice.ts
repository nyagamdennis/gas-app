/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import getApiUrl from "../../getApiUrl";
import Cookies from "cookies-js"

const apiUrl = getApiUrl()
const PRODUCT_URLS = `${apiUrl}/assignedcylider/`;



interface assignedProducts {
  assigned_quantity: number;
  cylinder: number;
  date_assigned: string;
  empties: number;
  filled: number;
  gas_type: string;
  id: string;
  max_retail_refil_price: number;
  max_retail_selling_price: number;
  max_wholesale_refil_price: number;
  max_wholesale_selling_price: number;
  min_retail_refil_price: number;
  min_retail_selling_price: number;
  min_wholesale_refil_price: number;
  min_wholesale_selling_price: number;
  retail_refil_price: number;
  retail_refilled: number;
  retail_selling_price: number;
  retail_sold: number;
  sales_team: {
    name: string;
  }

  profile_image: string;
  spoiled: number;
  transaction_complete: boolean;
  weight: number;
  wholesale_refil_price: number;
  wholesale_refilled: number;
  wholesale_selling_price: number;
  wholesale_sold: number;
}

interface assignedProductsState {
  assignedProducts: assignedProducts[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

interface FetchProductsResponse {
  data: assignedProducts[];
}

const initialState: assignedProductsState = {
  assignedProducts: [],
  status: "idle",
  error: null,
};

export const fetchAssignedProducts = createAsyncThunk<assignedProducts[], void, {}>(
  "assignedProducts/fetchAssignedProducts",
  async () => {
    const response = await axios.get<assignedProducts[]>(PRODUCT_URLS, {
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    });
    return response.data;
  }
);


// export const addSpoiledCylinder = createAsyncThunk(
//     "addspoiledcylinder/addSpoiledCylinder",
//     async () => {
//       const response = await axios.post<assignedProducts[]>(PRODUCT_URLS, {
//         headers: {
//           Authorization: `Bearer ${Cookies.get("accessToken")}`,
//         },
//       });
//       return response.data;
//     }
//   );

export const addSpoiledCylinder = createAsyncThunk(
  "assignedProducts/addSpoiledCylinder",
  async ({ id, spoiled }: { id: string; spoiled: number }) => {
    const response = await axios.post(
      `${apiUrl}/addspoiled/`, // Add correct endpoint
      { id, spoiled },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }
    );
    return response.data;
  }
);

export const updateSpoiledCylinder = createAsyncThunk(
  "assignedProducts/updateSpoiledCylinder",
  async ({ id, spoiled }: { id: string; spoiled: number }) => {
    const response = await axios.post(
      `${apiUrl}/updatespoiled/`, // Add correct endpoint
      { id, spoiled },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }
    );
    return response.data;
  }
);


const assignedProductsSlice = createSlice({
  name: "assignedProducts",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAssignedProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAssignedProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.assignedProducts = action.payload;
      })
      .addCase(fetchAssignedProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch products";
      })
      .addCase(addSpoiledCylinder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addSpoiledCylinder.fulfilled, (state, action) => {
        const updatedProduct = action.payload; // The updated product returned from the API
        const productIndex = state.assignedProducts.findIndex(
          (product) => product.id === updatedProduct.id
        );
        if (productIndex !== -1) {
          state.assignedProducts[productIndex] = updatedProduct;
        }
      })
      .addCase(addSpoiledCylinder.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update spoiled cylinders";
      })
      .addCase(updateSpoiledCylinder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateSpoiledCylinder.fulfilled, (state, action) => {
        const updatedProduct = action.payload; // The updated product returned from the API
        const productIndex = state.assignedProducts.findIndex(
          (product) => product.id === updatedProduct.id
        );
        if (productIndex !== -1) {
          state.assignedProducts[productIndex] = updatedProduct;
        }
      })
      .addCase(updateSpoiledCylinder.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update spoiled cylinders";
      });
  },
});

export const selectAllAssignedProducts = (state: { assignedProducts: assignedProductsState }) =>
  state.assignedProducts.assignedProducts;
export const getAssignedProductstatus = (state: { assignedProducts: assignedProductsState }) =>
  state.assignedProducts.status;
export const getDebtorsError = (state: { assignedProducts: assignedProductsState }) =>
  state.assignedProducts.error;

export default assignedProductsSlice.reducer;
