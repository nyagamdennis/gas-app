/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../utils/api"


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
    async (
      { salesDate }: {  salesDate?: string } = {}
    ) => {
      const params: Record<string, string> = {};
    if (salesDate) params.salesDate = salesDate;
      const response = await api.get("/salesteamdata", { params });
      return response.data; // Corrected the return statement
    }
  );
  


export const deleteSalesTeamData = createAsyncThunk(
    "salesTeamData/deleteSalesTeamData",
    async (
      { deleteSaleId }: {  deleteSaleId?: string } = {}
    ) => {
      const params: Record<string, string> = {};
    if (deleteSaleId) params.deleteSaleId = deleteSaleId;
      const response = await api.delete("/salesteamdata", { params });
      // Ensure the thunk returns the id we asked to delete when available,
      // otherwise fall back to whatever the server returned (id or raw value)
      const serverId = (response && (response.data?.id ?? response.data)) ?? null;
      return deleteSaleId ?? serverId;
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
      .addCase(fetchSalesTeamData.rejected, (state, action) => {state.status = "failed"
        state.error = action.error.message
      })
      .addCase(deleteSalesTeamData.pending, (state, action) => {
        state.status = "loading"
      })
      .addCase(deleteSalesTeamData.fulfilled, (state, action) => {
        state.status = "succeeded"
        // remove deleted record from state: prefer the original arg.deleteSaleId (what we requested),
        // then consider payload as string or object with id/deletedId
        const argDeleteId = (action.meta as any)?.arg?.deleteSaleId;
        const payload = action.payload as any;
        const deletedId = argDeleteId ?? (typeof payload === "string" ? payload : payload?.id ?? payload?.deletedId ?? null);

        // Only mutate state here; avoid side effects (e.g. alert) inside reducers
        if (deletedId != null) {
          state.salesTeamData = state.salesTeamData.filter(item => item.id !== deletedId)
        }
      })
      .addCase(deleteSalesTeamData.rejected, (state, action) => {
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
