/* eslint-disable prettier/prettier */
// @ts-nocheck
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../utils/api"


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
    // const response = await axios.get<Requested[]>(`${apiUrl}/cylinder-request-get/${salesTeamId}/`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${Cookies.get("accessToken")}`,
    //       "Content-Type": "application/json",
    //     },
    //   });
    const response = await api.get(`/cylinder-request-get/${salesTeamId}/`)
    return response.data; // Return the fetched employees data
  }
);



export const fetchAllRequests = createAsyncThunk<Requested[]>(
  "requested/fetchAllRequests",
  async () => {
    // const response = await axios.get<Requested[]>(`${apiUrl}/all-request/`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${Cookies.get("accessToken")}`,
    //       "Content-Type": "application/json",
    //     },
    //   });
    const response = await api.get("/all-request/")
    return response.data; // Return the fetched employees data
  }
);




export const clearRequested = createAsyncThunk(
  "requested/clearRequested",
  async ({ cylinderId }) => {
    // const response = await axios.post(
    //   `${apiUrl}/cylinder-request-clear/${cylinderId}/`,
    //   {}, // Empty body
    //   {
    //     headers: {
    //       Authorization: `Bearer ${Cookies.get("accessToken")}`,
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
    const response = await api.delete(`/approve-request/${cylinderId}/`)
    return response.data
  }
)

export const addRequest = createAsyncThunk(
  "requested/addRequest",
  async ({ employee, sales_team_id, assigned_cylinder_id, quantity }) => {
    const formData = {
      employee: employee,
      sales_team: sales_team_id,
      cylinder: assigned_cylinder_id,
      quantity: quantity,
      date_issued: new Date().toISOString(),
    };

    try {
      // const response = await axios.post(`${apiUrl}/cylinder-request/`, formData, {
      //   headers: {
      //     Authorization: `Bearer ${Cookies.get("accessToken")}`,
      //     "Content-Type": "application/json",
      //   },
      // });
      const response = await api.post("/cylinder-request/", formData)
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to add request.");
    }
  }
);

export const approveRequest = createAsyncThunk(
  "requested/approveRequest",
  async ({cylinderId}) => {
    // const response = await axios.post(`${apiUrl}/approve-request/${cylinderId}/`,
    //   {},
    //   {
    //     headers: {
    //       Authorization: `Bearer ${Cookies.get("accessToken")}`,
    //       "Content-Type": "application/json"
    //     }
    //   }
    // )
    const response = await api.post(`/approve-request/${cylinderId}/`)
    return response.data
  }
)

const requestedSlice = createSlice({
  name: "requested",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
    .addCase(fetchAllRequests.pending, (state) => {
      state.status = "loading";
    })
    .addCase(fetchAllRequests.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.requested = action.payload;
    })
    .addCase(fetchAllRequests.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Failed to fetch employees";
    })

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
      .addCase(approveRequest.pending, (state) => {
        state.status = "loading";
      })
      .addCase(approveRequest.fulfilled, (state, action) => {
        state.status = "succeeded";
        const removedId = action.meta.arg.cylinderId; // ✅ Correctly extract cylinderId
        // Filter out the removed item
        state.requested = state.requested.filter((item) => item.cylinder !== removedId);
       
      })
      .addCase(approveRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch employees";
      })

  },
});

export const selectAllRequests = (state: { requested: RequestedState }) => state.requested.requested;
export const getRequestedStatus = (state: { requested: RequestedState }) => state.requested.status;
export const getRequestedError = (state: { requested: RequestedState }) => state.requested.error;

export default requestedSlice.reducer;
