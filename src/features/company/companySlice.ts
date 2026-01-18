/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "cookies-js"
import api from "../../../utils/api"




interface Business {
  id: number;
  location: {
    id: number;
    name:string;
  };
  name: string;
  type_of_business: number;
  owner: string;
}

interface BusinessState {
    business: Business[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

interface FetchBusinessResponse {
  data: Business[];
}

const initialState: BusinessState = {
    business: [],
    status: "idle",
    error: null,
};

export const fetchBusiness = createAsyncThunk<Business[], void, {}>(
    "business/fetchBusiness",
    async () => {
      const response = await api.get('/company/');
      return response.data;
    }
  );
  

const companySlice = createSlice({
  name: "business",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchBusiness.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBusiness.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.business = action.payload;
      })
      .addCase(fetchBusiness.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch business";
      });
  },
});

export const selectAllBusiness = (state: { business: BusinessState }) =>
  state.business.business;
export const getBusinessStatus = (state: { business: BusinessState }) =>
  state.business.status;
export const getBusinessError = (state: { business: BusinessState }) =>
  state.business.error;

export default companySlice.reducer;
