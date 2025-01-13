/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "cookies-js"
import getApiUrl from "../../getApiUrl";

const apiUrl = getApiUrl()



interface MyProfile {
  id: number;
  user: {
    id: string;
    username: string;
  };
    first_name: string;
    last_name: string;
    id_number: number;
    phone: string;
    alternative_phone: string;
    gender: string;
    profile_image: string;
    front_id: string;
    back_id: string;
    sales_team: string;
    verified: boolean;
    defaulted: boolean;
    suspended: boolean;
    fired: boolean;
}

interface MyProfileState {
  myProfile: MyProfile[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}



const initialState: MyProfileState = {
  myProfile: [],
  status: "idle",
  error: null,
};

export const fetchMyProfile = createAsyncThunk<MyProfile[], void, {}>(
    "myProfile/fetchMyProfile",
    async () => {
      const response = await axios.get<MyProfile[]>(`${apiUrl}/myprofile/`,
        {
            headers: {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            },
          }
      );
      return response.data;
    }
  );
  

export const updateMyProfile = createAsyncThunk(
    "myProfile/updateMyProfile",
    async (formData) => {
      const response = await axios.put(`${apiUrl}/myprofile/`, formData,
        {
            headers: {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            },
          }
      );
      return response.data;
    }
  );
  

export const createMyProfile = createAsyncThunk(
    "myProfile/createMyProfile",
    async (formData) => {
      const response = await axios.post(`${apiUrl}/myprofile/`, formData,
        {
            headers: {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            },
          }
      );
      return response.data;
    }
  );
  



const myProfileSlice = createSlice({
  name: "myProfile",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchMyProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.myProfile = action.payload;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch customers";
      })
      .addCase(updateMyProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.myProfile = action.payload;
      })
      .addCase(updateMyProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to update customers";
      })
      .addCase(createMyProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createMyProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.myProfile = action.payload;
      })
      .addCase(createMyProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to update customers";
      })
  },
});

export const selectMyProfile = (state: { myProfile: MyProfileState }) =>
  state.myProfile.myProfile;
export const getmyProfileStatus = (state: { myProfile: MyProfileState }) =>
  state.myProfile.status;
export const getmyProfileError = (state: { myProfile: MyProfileState }) =>
  state.myProfile.error;

export default myProfileSlice.reducer;
