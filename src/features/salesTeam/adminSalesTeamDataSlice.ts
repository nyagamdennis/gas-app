/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "cookies-js"
import getApiUrl from "../../getApiUrl";

const apiUrl = getApiUrl();


interface AdminSalesTeamData {
  id: string;
  name: number;
  product: number;
  timestamp: string;
}

interface adminSalesTeamDataState {
  adminSalesTeamData: AdminSalesTeamData[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null | undefined;
}



const initialState: adminSalesTeamDataState = {
  adminSalesTeamData: [],
  status: "idle",
  error: null,
};



export const fetchAdminSalesTeamData = createAsyncThunk(
  "adminSalesTeamData/fetchAdminSalesTeamData",
  async () => {
    const response = await axios.get(`${apiUrl}/adminsalesteamdata`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }
    );
    return response.data; // Corrected the return statement
  }
);



export const toggleVerification = createAsyncThunk(
  "adminSalesTeamData/toggleVerification",
  async (saleId) => {
      const response = await axios.patch(
          `${apiUrl}/adminsverifyalesteamdata/${saleId}/`,
          null,
          {
              headers: {
                  Authorization: `Bearer ${Cookies.get("accessToken")}`,
              },
          }
      );
      return response.data; // Return the updated sale
  }
);


const adminSalesTeamDataSlice = createSlice({
  name: "adminSalesTeamData",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAdminSalesTeamData.pending, (state, action) => {
        state.status = "loading"
      })
      .addCase(fetchAdminSalesTeamData.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.adminSalesTeamData = action.payload;

      })
      .addCase(fetchAdminSalesTeamData.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
      .addCase(toggleVerification.pending, (state, action) => {
        state.status = "loading"
      })
      .addCase(toggleVerification.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedSale = action.payload;
        state.adminSalesTeamData = state.adminSalesTeamData.map((sale) =>
          sale.id === updatedSale.id ? updatedSale : sale
        );
      })
      .addCase(toggleVerification.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })

  },
});


export const selectAllAdminSalesTeamData = (state: { adminSalesTeamData: adminSalesTeamDataState }) =>
  state.adminSalesTeamData.adminSalesTeamData;

export const getAdminSalesTeamStatus = (state: { adminSalesTeamData: adminSalesTeamDataState }) =>
  state.adminSalesTeamData.status;
export const getAdminError = (state: { adminsalesTeamData: adminSalesTeamDataState }) =>
  state.adminsalesTeamData.error;

export default adminSalesTeamDataSlice.reducer;