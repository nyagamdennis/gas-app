/* eslint-disable prettier/prettier */
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import jwt_decode from "jwt-decode";
import cookies from "cookies-js";
import getApiUrl from "../../getApiUrl";

interface User {
    email: string;
    first_name:  string;
    last_name:  string;
    phone_number: number;
    role: string; 
  }
  
  interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
  }
  
interface LoginPayload {
    user: any;
    accessToken: string;
    refreshToken: string;
  }


const userCookie = cookies.get("user");
const accessTokenCookie = cookies.get("accessToken");
const accessRefreshCookie = cookies.get("refreshToken");

let user = null;
let accessToken = null;
let refreshToken = null;

if (userCookie && accessTokenCookie && accessRefreshCookie) {
  try {
    user = JSON.parse(userCookie);
    accessToken = accessTokenCookie;
    refreshToken = accessRefreshCookie;
  } catch (e) {
   console.log("l")
  }
}

// const initialState = {
//   user,
//   accessToken,
//   refreshToken,
//   isLoading: false,
//   error: null,
// };

const initialState: AuthState = {
    user,
    accessToken,
    refreshToken,
    isLoading: false,
    error: null,
    isAuthenticated: !!accessToken,
  };
 

const apiUrl = getApiUrl()


export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<LoginPayload>) => {
      const timers = 60 * 86400;
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isLoading = false;
      state.error = null;
      state.isAuthenticated = true;
      cookies.set("refreshToken", refreshToken, { expires: timers });
      cookies.set("user", JSON.stringify(user), { expires: timers });
      cookies.set("accessToken", accessToken, { expires: timers });
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      console.log("Login failure ", action.payload)
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      cookies.expire("user");
      cookies.expire("accessToken");
      cookies.expire("refreshToken");
    },
  },
});



export const { loginStart, loginFailure, loginSuccess, logoutSuccess } =
  authSlice.actions;

export const login = (credentials: any) => async (dispatch: any) => {
  try {
    dispatch(loginStart());
    const response = await axios.post(
      `${apiUrl}/users/token/`,
      credentials
    );
    const accessToken = response.data.access;
    const refreshToken = response.data.refresh;
    const decodedToken: any = jwt_decode(accessToken);
    // const user = decodedToken;
    
    const user: User = {
      email: decodedToken.email,
      first_name: decodedToken.first_name,
      last_name: decodedToken.last_name,
      phone_number: decodedToken.phone_number,
      role: decodedToken.role, // Extract role
    
    };
    dispatch(loginSuccess({ user, accessToken, refreshToken }));

    const timer = 240;
    const intervalId = setInterval(() => {
      dispatch(refreshAccessToken());
    }, timer * 1000);
    dispatch({ type: "SET_INTERVAL_ID", payload: intervalId });
    // new change=> return the response data here // return a promise so as it can be waited in the component
    return response.data;
  } catch (error:any) {
    
    const message =
      error.response?.data?.detail || "An unknown error occurred.";
    dispatch(loginFailure(message));
    throw error; // re-throw the error
  }
};

export const logout = () => (dispatch: any) => {
  dispatch(logoutSuccess());
};

export const refreshAccessToken = () => async (dispatch: any, getState: any) => {
  try {
    // const { refreshToken } = accessRefreshCookie;
    const newrefreshToken = cookies.get("refreshToken");

    const response = await axios.post(
      `${apiUrl}/users/token/refresh/`,
      { refresh: newrefreshToken }
    );
    const accessToken = response.data.access;
    const refreshToken = response.data.refresh;
    const decodedToken = jwt_decode(accessToken);
    const user = decodedToken;

    dispatch(loginSuccess({ user, accessToken, refreshToken }));
  } catch (error) {
    console.error(error);
    dispatch(logout());
  }
};


export const selectUserRole = (state: { auth: AuthState }) =>
  state.auth.user?.role || "guest"; 

export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.accessToken !== null;

// new change
export const selectAuthLoading = (state: { auth: AuthState }) =>
  state.auth.isLoading;

export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

export default authSlice.reducer;

// export const getSearchesStatus = (state) => state.searches.status;
// export const getSearchesError = (state) => state.searches.error;