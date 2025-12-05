/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../utils/api"


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
  async (
    { teamId, salesDate }: { teamId?: string; salesDate?: string } = {}
  ) => {
    const params: Record<string, string> = {};
    if (teamId) params.teamId = teamId;
    if (salesDate) params.salesDate = salesDate;
    // console.log('sales date ', salesDate)
    // console.log('team id s ', teamId)

    const response = await api.get("/adminsalesteamdata", { params });
    return response.data;
  }
);



export const toggleVerification = createAsyncThunk(
  "adminSalesTeamData/toggleVerification",
  async ({saleId, paymentType}:{saleId: string; paymentType:string}) => {
  
      // const response = await axios.patch(
      //     `${apiUrl}/adminsverifyalesteamdata/${saleId}/`,
      //     {paymentType:paymentType},
      //     {
      //         headers: {
      //             Authorization: `Bearer ${Cookies.get("accessToken")}`,
      //         },
      //     }
      // );
      const response = await api.patch(`/adminsverifyalesteamdata/${saleId}/`, {
        paymentType: paymentType,
      });
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