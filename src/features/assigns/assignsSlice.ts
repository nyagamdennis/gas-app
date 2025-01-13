/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import getApiUrl from "../../getApiUrl";
import Cookies from "cookies-js"

const apiUrl = getApiUrl()



interface Assigns {
  id: string;
  name: number;
  product: number;
  timestamp: string;
}

interface AssignsState {
    assigns: Assigns[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null | undefined;
}



const initialState: AssignsState = {
    assigns: [],
    status: "idle",
    error: null,
};


export const fetchAssignedCylinders = createAsyncThunk(
  "assignedCylinders/fetchAssignedCylinders",
  async (salesTeamId) => {
    console.log('params ', salesTeamId)
    const response = await axios.get(`${apiUrl}/the-assigned-cylinders/`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
      params: {
        sales_team: salesTeamId,
      },
      
    });
    return response.data;
  }
);


export const assignCylinders = createAsyncThunk(
    'assignCylinders/assignCylinders',
    async (payload) => {
      const response = await axios.post(`${apiUrl}/assign-cylinders/`, payload, {
        headers: {
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    }
  );



const assignsSlice = createSlice({
  name: "assigns",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      
      .addCase(assignCylinders.pending, (state, action) => {
        state.status = "loading"
      })
      .addCase(assignCylinders.fulfilled, (state, action) => {
        state.status = "succeeded"
        // state.assigns.push(action.payload);
      })
      .addCase(assignCylinders.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
      .addCase(fetchAssignedCylinders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAssignedCylinders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.assigns = action.payload;
      })
      .addCase(fetchAssignedCylinders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectAllAssigns = (state: { assigns: AssignsState}) =>
  state.assigns.assigns;
export const getAssignsStatus = (state: { assigns: AssignsState}) =>
  state.assigns.status;
export const getAssignsError = (state: { assigns: AssignsState}) =>
  state.assigns.error;

export default assignsSlice.reducer;
