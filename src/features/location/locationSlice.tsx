/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import getApiUrl from "../../getApiUrl";

const apiUrl = getApiUrl()
const LOCATION_URLS = `${apiUrl}/locations/`;


interface Locations {
  id: number;
  name: string;
}

interface LocationsState {
    locations: Locations[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

interface FetchLocationsResponse {
  data: Locations[];
}

const initialState: LocationsState = {
    locations: [],
    status: "idle",
    error: null,
};

export const fetchLocations = createAsyncThunk<Locations[], void, {}>(
    "customers/fetchLocations",
    async () => {
      const response = await axios.get<Locations[]>(LOCATION_URLS);
      return response.data; // Corrected the return statement
    }
  );
  

const locationsSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.locations = action.payload;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch locations";
      });
  },
});

export const selectAllLocations = (state: { locations: LocationsState }) =>
  state.locations.locations;
export const getLocationStatus = (state: { locations: LocationsState }) =>
  state.locations.status;
export const getDebtorsError = (state: { locations: LocationsState }) =>
  state.locations.error;

export default locationsSlice.reducer;
