/* eslint-disable prettier/prettier */
// @ts-nocheck
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "cookies-js"
import getApiUrl from "../../getApiUrl";

const apiUrl = getApiUrl();


interface Requested {
  id: number;

}

interface RequestedState {
  requested: Requested[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: RequestedState = {
  requested: [],
  status: "idle",
  error: null,
};

export const fetchRequests = createAsyncThunk<Requested[]>(
  "requested/fetchRequests",
  async ({ salesTeamId }) => {
    const response = await axios.get<Requested[]>(`${apiUrl}/cylinder-request-get/${salesTeamId}/`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
          "Content-Type": "application/json",
        },
      });
    return response.data; // Return the fetched employees data
  }
);

export const clearRequested = createAsyncThunk(
  "requested/clearRequested",
  async ({ cylinderId }) => {
    const response = await axios.post(
      `${apiUrl}/cylinder-request-clear/${cylinderId}/`,
      {}, // Empty body
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
          "Content-Type": "application/json",
        },
      }
    );


    return response.data
  }
)


export const addRequest = createAsyncThunk(
  "requested/addRequest",
  async ({ employee, sales_team_id, assigned_cylinder_id, quantity }) => {
    console.log("Adding request...");

    const formData = {
      employee: employee,
      sales_team: sales_team_id,
      cylinder: assigned_cylinder_id,
      quantity: quantity,
      date_issued: new Date().toISOString(),
    };

    console.log("Form data: ", formData);

    try {
      const response = await axios.post(`${apiUrl}/cylinder-request/`, formData, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Request Failed:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to add request.");
    }
  }
);



const requestedSlice = createSlice({
  name: "requested",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Fetch Employees
      .addCase(fetchRequests.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.requested = action.payload;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch employees";
      })
      .addCase(clearRequested.pending, (state) => {
        state.status = "loading";
      })
      .addCase(clearRequested.fulfilled, (state, action) => {
        state.status = "succeeded";
        const removedId = action.meta.arg.cylinderId; // ✅ Correctly extract cylinderId
        // Filter out the removed item
        state.requested = state.requested.filter((item) => item.cylinder !== removedId);
       
      })
      .addCase(clearRequested.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch employees";
      })
      .addCase(addRequest.pending, (state) => {
        state.status = "loading";
      })

      .addCase(addRequest.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Extract updated employee from the payload
        const updatedRequest = action.payload;
        // state.requested = [...state.requested, updatedRequest];
        const existingIndex = state.requested.findIndex(
          (req) => req.id === updatedRequest.id
        );

        if (existingIndex !== -1) {
          // If it exists, update the existing request
          state.requested[existingIndex] = updatedRequest;
        } else {
          // If it doesn't exist, add it to the array
          state.requested.push(updatedRequest);
        }

      })
      .addCase(addRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to add salary.";
      })

  },
});

export const selectAllRequests = (state: { requested: RequestedState }) => state.requested.requested;
export const getRequestedStatus = (state: { requested: RequestedState }) => state.requested.status;
export const getRequestedError = (state: { requested: RequestedState }) => state.requested.error;

export default requestedSlice.reducer;
