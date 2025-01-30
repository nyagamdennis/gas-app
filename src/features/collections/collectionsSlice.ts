/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import getApiUrl from "../../getApiUrl";
import Cookies from "cookies-js"

const apiUrl = getApiUrl()



interface Collections {
  id: string;
  name: number;
  product: number;
  timestamp: string;
}

interface CollectionsState {
    collections: Collections[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null | undefined;
}



const initialState: CollectionsState = {
    collections: [],
    status: "idle",
    error: null,
};


export const fetchCollectedCylinders = createAsyncThunk(
  "collectedCylinders/fetchCollectedCylinders",
  async (salesTeamId) => {
    const response = await axios.get(`${apiUrl}/after-return/`, {
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


// export const assignCylinders = createAsyncThunk(
//     'assignCylinders/assignCylinders',
//     async (payload) => {
//       const response = await axios.post(`${apiUrl}/assign-cylinders/`, payload, {
//         headers: {
//           Authorization: `Bearer ${Cookies.get('accessToken')}`,
//           'Content-Type': 'application/json',
//         },
//       });
//       return response.data;
//     }
//   );



const Slice = createSlice({
  name: "collections",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
    //   .addCase(assignCylinders.pending, (state, action) => {
    //     state.status = "loading"
    //   })
    //   .addCase(assignCylinders.fulfilled, (state, action) => {
    //     state.status = "succeeded"
    //     // state.collections.push(action.payload);
    //   })
    //   .addCase(assignCylinders.rejected, (state, action) => {
    //     state.status = "failed"
    //     state.error = action.error.message
    //   })
      .addCase(fetchCollectedCylinders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCollectedCylinders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.collections= action.payload;
      })
      .addCase(fetchCollectedCylinders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectAllCollections = (state: { collections: CollectionsState}) =>
  state.collections.collections;
export const getCollectionsStatus = (state: { collections: CollectionsState}) =>
  state.collections.status;
export const getCollectionsError = (state: { collections: CollectionsState}) =>
  state.collections.error;

export default Slice.reducer;
