/* eslint-disable prettier/prettier */
// @ts-nocheck
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
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
  vehicles: Vehicles[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
  currentVehicle: Vehicles | null
}

const initialState: VehiclesState = {
  vehicles: [],
  status: "idle",
  error: null,
  currentVehicle: null,
}

export const fetchVehicles = createAsyncThunk<
  Vehicles[],
  { businessId: string },
  {}
>("vehicles/fetchVehicles", async ({ businessId }) => {
  const response = await api.get(`/vehicle/`)
  console.log("all vehocle ", response.data)
  return response.data
})



export const addVehicle = createAsyncThunk<
  Vehicles, // The type of the returned data
  {
    business: number
    type_of_vehicle: string
    vehicle_number: string
    engine_capacity: string
    driver: string
    conductor?: string // Optional for motorbikes
  },
  { rejectValue: string } // Type for rejected value
>("vehicles/addVehicle", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post(`/vehicle/`, formData) // API call to add a new vehicle
    return response.data // Return the newly added vehicle
  } catch (error: any) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data.message) // Return API error message
    }
    return rejectWithValue("Failed to add vehicle. Please try again.")
  }
})

export const deleteVehicle = createAsyncThunk<
  number, // The type of the returned data (vehicle ID)
  number, // The type of the argument (vehicle ID)
  { rejectValue: string } // Type for rejected value
>("vehicles/deleteVehicle", async (vehicleId, { rejectWithValue }) => {
  try {
    await api.delete(`/vehicle/vehicle/${vehicleId}/`) // API call to delete the vehicle
    return vehicleId // Return the deleted vehicle ID
  } catch (error: any) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data.message) // Return API error message
    }
    return rejectWithValue("Failed to delete vehicle. Please try again.")
  }
})


export const updateVehicle = createAsyncThunk(
  "vehicle/updateVehicle",
  async (
    { id, data }: { id: number; data: Partial<Vehicles> },
    { rejectWithValue },
  ) => {
    try {
      const token = localStorage.getItem("token")
      const response = await api.patch(`/vehicle/vehicle/${id}/`, data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update vehicle")
    }
  },
)

const vehiclesSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {
    setCurrentVehicle: (state, action: PayloadAction<Vehicles | null>) => {
      state.currentVehicle = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers(builder) {
    builder
      // Fetch Vehicles
      .addCase(fetchVehicles.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.vehicles = action.payload
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch vehicles"
      })
      .addCase(addVehicle.pending, (state) => {
        state.status = "loading"
      })
      .addCase(addVehicle.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.vehicles.unshift(action.payload.vehicle) // Add the new vehicle to the state
      })
      .addCase(addVehicle.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string // Set the error message
      })
      .addCase(deleteVehicle.pending, (state) => {
        state.status = "loading"
      })
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.vehicles = state.vehicles.filter(
          (vehicle) => vehicle.id !== action.payload,
        ) // Remove the deleted vehicle from the state
      })
      .addCase(deleteVehicle.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string // Set the error message
      })
      .addCase(updateVehicle.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(updateVehicle.fulfilled, (state, action) => {
        state.status = "succeeded"
        const index = state.vehicles.findIndex(
          (v) => v.id === action.payload.vehicle.id,
        )
        if (index !== -1) {
          state.vehicles[index] = action.payload.vehicle
        }
        if (state.currentVehicle?.id === action.payload.vehicle.id) {
          state.currentVehicle = action.payload.vehicle
        }
      })
      .addCase(updateVehicle.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })
  },
})


export const { setCurrentVehicle, clearError } = vehiclesSlice.actions


export const getAllVehicles = (state: { vehicles: VehiclesState }) =>
  state.vehicles.vehicles
export const getVehiclesStatus = (state: { vehicles: VehiclesState }) =>
  state.vehicles.status
export const getVehiclesError = (state: { vehicles: VehiclesState }) =>
  state.vehicles.error
export const selectCurrentVehicle = (state: { vehicles: VehiclesState }) =>
  state.vehicles.currentVehicle


export default vehiclesSlice.reducer
