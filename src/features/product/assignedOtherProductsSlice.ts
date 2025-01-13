/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import getApiUrl from "../../getApiUrl";
import Cookies from "cookies-js"

const apiUrl = getApiUrl()
const PRODUCT_URLS = `${apiUrl}/assignedproduct/`;



interface assignedOtherProducts {
  assigned_quantity: number;
  product: string;
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

interface assignedOtherProductsState {
  assignedOtherProducts: assignedOtherProducts[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}


const initialState: assignedOtherProductsState = {
  assignedOtherProducts: [],
  status: "idle",
  error: null,
};

export const fetchAssignedOtherProducts = createAsyncThunk<assignedOtherProducts[], void, {}>(
  "assignedOtherProducts/fetchAssignedOtherProducts",
  async () => {
    const response = await axios.get<assignedOtherProducts[]>(PRODUCT_URLS, {
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
//       const response = await axios.post<assignedOtherProducts[]>(PRODUCT_URLS, {
//         headers: {
//           Authorization: `Bearer ${Cookies.get("accessToken")}`,
//         },
//       });
//       return response.data;
//     }
//   );

export const addSpoiledCylinder = createAsyncThunk(
  "assignedOtherProducts/addSpoiledCylinder",
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
  "assignedOtherProducts/updateSpoiledCylinder",
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


const assignedOtherProductsSlice = createSlice({
  name: "assignedOtherProducts",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAssignedOtherProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAssignedOtherProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.assignedOtherProducts = action.payload;
      })
      .addCase(fetchAssignedOtherProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch products";
      })
      .addCase(addSpoiledCylinder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addSpoiledCylinder.fulfilled, (state, action) => {
        const updatedProduct = action.payload; // The updated product returned from the API
        const productIndex = state.assignedOtherProducts.findIndex(
          (product) => product.id === updatedProduct.id
        );
        if (productIndex !== -1) {
          state.assignedOtherProducts[productIndex] = updatedProduct;
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
        const productIndex = state.assignedOtherProducts.findIndex(
          (product) => product.id === updatedProduct.id
        );
        if (productIndex !== -1) {
          state.assignedOtherProducts[productIndex] = updatedProduct;
        }
      })
      .addCase(updateSpoiledCylinder.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update spoiled cylinders";
      });
  },
});

export const selectAllAssignedOtherProducts = (state: { assignedOtherProducts: assignedOtherProductsState }) =>
  state.assignedOtherProducts.assignedOtherProducts;
export const getAssignedOtherProductstatus = (state: { assignedOtherProducts: assignedOtherProductsState }) =>
  state.assignedOtherProducts.status;
export const getDebtorsError = (state: { assignedOtherProducts: assignedOtherProductsState }) =>
  state.assignedOtherProducts.error;

export default assignedOtherProductsSlice.reducer;
