// singlesalesteamdata/<str:pk/>

/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../utils/api"


interface SingleSalesTeamData {
  id: string;
  name: number;
  product: number;
  timestamp: string;
}

interface SingleSalesTeamDataState {
    singleSalesTeamData: SingleSalesTeamData[]; 
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null | undefined;
}



const initialState: SingleSalesTeamDataState = {
    singleSalesTeamData: [],
    status: "idle",
    error: null,
};



export const fetchSingleSalesTeamData = createAsyncThunk(
    "singleSalesTeamData/fetchSingleSalesTeamData",
    async ({id}:{id:string}) => {
      const response = await api.get(`singlesalesteamdata/${id}/`);
      return response.data; // Corrected the return statement
    }
  );




const singleSalesTeamDataSlice = createSlice({
  name: "singleSalesTeamData",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
    
      .addCase(fetchSingleSalesTeamData.pending, (state, action) => {
        state.status = "loading"
      })
      .addCase(fetchSingleSalesTeamData.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.singleSalesTeamData = action.payload;
       
      })
      .addCase(fetchSingleSalesTeamData.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
  },
});


export const selectSingleSalesTeamData = (state: { singleSalesTeamData: SingleSalesTeamDataState }) =>
  state.singleSalesTeamData.singleSalesTeamData;


export const getSingleSalesTeamStatus = (state: { singleSalesTeamData: SingleSalesTeamDataState }) =>
  state.singleSalesTeamData.status;
export const getSingleSalesDataError = (state: { singleSalesTeamData: SingleSalesTeamDataState }) =>
  state.singleSalesTeamData.error;

export default singleSalesTeamDataSlice.reducer;
