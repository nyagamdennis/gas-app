/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../../utils/api"

interface Vehicles {
  id: number
  business: number
  type_of_vehicle: string
  vehicle_number: string
  engine_capacity: string
  driver: string
  date_added: string
}


interface VehiclesState {
  vehicles: Vehicles[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: VehiclesState = {
  vehicles: [],
  status: "idle",
  error: null,
};


export const fetchVehicles = createAsyncThunk<Vehicles[], { businessId: string },{}>(
  "vehicles/fetchVehicles",
  async ({ businessId }) => {
    const response = await api.get(`/vehicles/`)
    return response.data; // Return the fetched vehicles data
  }
);


export const addVehicle = createAsyncThunk<
  Vehicles, // The type of the returned data
  { 
    business: number; 
    type_of_vehicle: string; 
    vehicle_number: string; 
    engine_capacity: string; 
    driver: string; 
    conductor?: string; // Optional for motorbikes
  }, 
  { rejectValue: string } // Type for rejected value
>(
  "vehicles/addVehicle",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/vehicles/`, formData); // API call to add a new vehicle
      return response.data; // Return the newly added vehicle
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message); // Return API error message
      }
      return rejectWithValue("Failed to add vehicle. Please try again.");
    }
  }
);


const vehiclesSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Fetch Vehicles
      .addCase(fetchVehicles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.vehicles = action.payload;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch vehicles";
      })
      .addCase(addVehicle.pending, (state) => {
  state.status = "loading";
})
.addCase(addVehicle.fulfilled, (state, action) => {
  state.status = "succeeded";
  state.vehicles.push(action.payload); // Add the new vehicle to the state
})
.addCase(addVehicle.rejected, (state, action) => {
  state.status = "failed";
  state.error = action.payload as string; // Set the error message
});
     
    
    
    
  },
});

export const getAllVehicles = (state: { vehicles: VehiclesState }) => state.vehicles.vehicles;
export const getVehiclesStatus = (state: { vehicles: VehiclesState }) => state.vehicles.status;
export const getVehiclesError = (state: { vehicles: VehiclesState }) => state.vehicles.error;

export default vehiclesSlice.reducer;
