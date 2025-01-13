/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import getApiUrl from "../../getApiUrl";

const apiUrl = getApiUrl()
const PRODUCT_URLS = `${apiUrl}/other-products/`;

type Status = "idle" | "loading" | "succeeded" | "failed";

interface otherProducts {
    id: string;
    name: string;
    whole_sales_price: number;
    retail_sales_price: number;
    quantity: number;
    dates: string;
    date_of_operation: string;
}

interface otherProductsState {
    otherProducts: otherProducts[];
    status: Status;
    error: string | null;


    addNewProductStatus: Status;
    addNewProductError: string | null | undefined;
}


const initialState: otherProductsState = {
    otherProducts: [],
    status: "idle",
    error: null,

    addNewProductStatus: 'idle',
    addNewProductError: null,

};

export const fetchOtherProducts = createAsyncThunk<otherProducts[], void, {}>(
    "otherProducts/fetchOtherProducts",
    async () => {
        // await new Promise((resolve) => setTimeout(resolve, 5000))
        const response = await axios.get<otherProducts[]>(PRODUCT_URLS);
        return response.data;
    }
);


export const addNewProduct = createAsyncThunk(
    "newProduct/ addNewProduct",
    async (formData) => {
        const response = await axios.post(`${PRODUCT_URLS}`, formData);
        return response.data;
    }
)


const otherProductsSlice = createSlice({
    name: "otherProducts",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchOtherProducts.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchOtherProducts.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.otherProducts = action.payload;
            })
            .addCase(fetchOtherProducts.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to fetch products";
            })
            .addCase(addNewProduct.pending, (state) => {
                state.addNewProductStatus = "loading";
            })
            .addCase(addNewProduct.fulfilled, (state, action) => {
                state.addNewProductStatus = "succeeded";
                state.otherProducts = action.payload;
            })
            .addCase(addNewProduct.rejected, (state, action) => {
                // state.status = "failed";
                state.addNewProductError = action.error.message || "Failed to fetch products";
            });
    },
});

export const selectAllOtherProducts = (state: { otherProducts: otherProductsState }) =>
    state.otherProducts.otherProducts;
export const getOtherProductstatus = (state: { otherProducts: otherProductsState }) =>
    state.otherProducts.status;
export const getOtherProductsError = (state: { otherProducts: otherProductsState }) =>
    state.otherProducts.error;

export default otherProductsSlice.reducer;
