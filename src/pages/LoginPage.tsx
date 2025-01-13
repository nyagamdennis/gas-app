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

  const handleUsernameInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const handlePwdInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const canSubmit = [email, password].every(Boolean);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Dispatch login action
    // @ts-ignore
    dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      // Check user's status after login
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

          if (is_admin) {
            console.log('is admin')
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
    <section className="h-screen bg-gradient-to-br from-pale-green to-whitish flex items-center justify-center">
      <div className="bg-gray-400 p-8 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-2xl font-bold text-center mb-6">Login</p>
          {errMsg && (
            <div>
              <Alert severity="error">{errMsg}</Alert>
            </div>
          )}

          <div>
            <label className="block mb-2">Email/Phone Number *</label>
            <div className="input-group mb-3 flex items-center bg-white rounded">
              <span className="input-group-text p-2 bg-gray-100 rounded-l">
                <PersonIcon />
              </span>
              <input
                type="text"
                placeholder="john@gmail.com or +2540000000"
                name="email"
                className="form-control p-2 flex-grow rounded-r outline-none"
                onChange={handleUsernameInput}
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2">Password *</label>
            <div className="input-group mb-3 flex items-center bg-white rounded">
              <span className="input-group-text p-2 bg-gray-100 rounded-l">
                <LockIcon />
              </span>
              <input
                type={passVisibility ? "text" : "password"}
                placeholder="password"
                name="password"
                className="form-control p-2 flex-grow rounded-r outline-none"
                onChange={handlePwdInput}
                required
              />
              <span onClick={handlePasswordVisibility} className="!bg-white">
                {passVisibility ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </span>
            </div>
          </div>

          <div className="flex justify-end mb-4">
            <Link className="underline text-sm" to="/forgot-password">
              Forgot Password?
            </Link>
          </div>

          <div>
            <button
              className="w-full bg-gradient-to-r from-green-500 to-yellow-400 font-bold cursor-pointer text-white py-2 px-4 rounded hover:bg-blue-600"
              disabled={!canSubmit || isLoading}
            >
              {isLoading ? <ClipLoader size={15} color={"#ffffff"} /> : "LOGIN"}
            </button>
          </div>

          <div className="text-center mt-4">
            <p>
              Don't have an account?{" "}
              <Link className="text-link-color font-bold" to="/register">
                SignUp
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
