/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "cookies-js"
import getApiUrl from "../../getApiUrl";

const apiUrl = getApiUrl();


interface SalesTeamData {
  id: string;
  name: number;
  product: number;
  timestamp: string;
}

interface SalesTeamDataState {
    salesTeamData: SalesTeamData[]; 
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null | undefined;
}



const initialState: SalesTeamDataState = {
    salesTeamData: [],
    status: "idle",
    error: null,
};



export const fetchSalesTeamData = createAsyncThunk(
    "salesTeamData/fetchSalesTeamData",
    async () => {
      const response = await axios.get(`${apiUrl}/salesteamdata`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      return response.data; // Corrected the return statement
    }
  );
  

  
 




const salesTeamDataSlice = createSlice({
  name: "salesTeamData",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
    
      .addCase(fetchSalesTeamData.pending, (state, action) => {
        state.status = "loading"
      })
      .addCase(fetchSalesTeamData.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.salesTeamData = action.payload;
       
      })
      .addCase(fetchSalesTeamData.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
  },
});


export const selectAllSalesTeamData = (state: { salesTeamData: SalesTeamDataState }) =>
  state.salesTeamData.salesTeamData;


export const getSalesTeamStatus = (state: { salesTeamData: SalesTeamDataState }) =>
  state.salesTeamData.status;
export const getDebtorsError = (state: { salesTeamData: SalesTeamDataState }) =>
  state.salesTeamData.error;

export default salesTeamDataSlice.reducer;
