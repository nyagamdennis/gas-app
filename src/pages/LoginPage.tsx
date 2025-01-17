import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import {
  login,
  selectAuthError,
  selectAuthLoading,
  selectIsAuthenticated,
} from "../features/auths/authSlice";
import { useAppSelector } from "../app/hooks";
import { useDispatch } from "react-redux";
import axios from "axios";
import getApiUrl from "../getApiUrl";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Alert from "@mui/material/Alert";
import Cookies from "cookies-js";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [passVisibility, setPasswordVisibility] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const error = useAppSelector(selectAuthError);
  const isLoading = useAppSelector(selectAuthLoading);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const apiUrl = getApiUrl();

  // const handleUsernameInput = (e:any) => setEmail(e.target.value);


  
  const handleUsernameInput = (e: any) => {
    const value = e.target.value;
    setEmail(value);
  
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setErrMsg("Please enter a valid email address.");
    } else {
      setErrMsg("");
    }
  };

  const handlePwdInput = (e:any) => setPassword(e.target.value);

  // const canSubmit = [email, password].every(Boolean);
  const canSubmit = [email, password].every(Boolean) && !errMsg;

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    // Dispatch login action
    // @ts-ignore
    dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      const checkUserStatus = async () => {
        try {
          const response = await axios.get(`${apiUrl}/check-user-status/`, {
            headers: {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            },
          });

          const {
            has_employee_profile,
            is_verified,
            is_admin,
          } = response.data;
          console.log('user status ', response.data)

          if (is_admin) {
            navigate("/", { state: { message: "Welcome, Admin!" } });
          } else if (has_employee_profile && !is_verified) {
            navigate("/myprofile", {
              state: { message: "Your profile is not verified. Please contact the admin." },
            });
          } else if (!has_employee_profile) {
            navigate("/createprofile", {
              state: { message: "Please create your employee profile to continue." },
            });
          } else {
            navigate("/sales"); // Default redirection for verified employees
          }
        } catch (error) {
          setErrMsg("Failed to verify user status. Please try again.");
        }
      };

      checkUserStatus();
    }
  }, [isAuthenticated, navigate, apiUrl]);

  useEffect(() => {
    if (error) {
      setErrMsg(error);
    }
  }, [error]);

  const handlePasswordVisibility = () => {
    setPasswordVisibility(!passVisibility);
  };

  
  return (
    <section className="h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-white to-green-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-11/12 sm:w-96">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h1 className="text-3xl font-bold text-center text-gray-800">Login</h1>

          {errMsg && (
            <Alert severity="error" className="text-sm">
              {errMsg}
            </Alert>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email/Phone Number
            </label>
            <div className="relative">
              <input
                id="email"
                type="text"
                placeholder="john@gmail.com or +2540000000"
                className="block w-full p-3 rounded border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-300 focus:ring-opacity-50"
                onChange={handleUsernameInput}
                required
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                <PersonIcon />
              </span>
            </div>
            {errMsg && <p className="text-red-500 text-sm mt-1">{errMsg}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={passVisibility ? "text" : "password"}
                placeholder="Enter your password"
                className="block w-full p-3 rounded border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-300 focus:ring-opacity-50"
                onChange={handlePwdInput}
                required
              />
              <button
                type="button"
                onClick={handlePasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 focus:outline-none"
              >
                {passVisibility ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-green-500 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded shadow focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-50 disabled:opacity-50"
            disabled={!canSubmit || isLoading}
          >
            {isLoading ? <ClipLoader size={20} color="#ffffff" /> : "Login"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{' '}
            <Link to="/register" className="text-green-500 font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
