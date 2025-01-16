import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Alert from "@mui/material/Alert";
import axios from "axios";
import getApiUrl from "../getApiUrl";

const RegisterPage = () => {
  const navigate = useNavigate();
  const apiUrl = getApiUrl();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [successful, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(3);
  const [passVisibility, setPasswordVisibility] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleEmailInput = (e:any) => setEmail(e.target.value);
  const handlePhone = (e:any) => setPhone(e.target.value);
  const handlePwdInput = (e:any) => setPassword(e.target.value);
  const handleConfirmPwdInput = (e:any) => setConfirmPassword(e.target.value);
  const handleTermsChange = (e:any) => setTermsAccepted(e.target.checked);

  const handleSubmit = async (event:any) => {
    event.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phone_number", phone);

    try {
      await axios.post(`${apiUrl}/users/register/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setPhone("");
      setError("");
      setLoading(false);
      setSuccess(true);
      setSuccessMessage("Registration successful! Redirecting to login...");

      let counter = 3;
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
        counter -= 1;

        if (counter === 0) {
          clearInterval(interval);
          navigate("/login", {
            state: { successMessage: "Registration successful. Please log in." },
          });
        }
      }, 1000);
    } catch (error:any) {
      setLoading(false);
      setSuccess(false);
      setError(
        error.response?.data?.detail || "An error occurred during registration."
      );
    }
  };

  const handlePasswordVisibility = () => {
    setPasswordVisibility(!passVisibility);
  };

  return (
    <section className="h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-white to-green-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-11/12 sm:w-96">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h1 className="text-3xl font-bold text-center text-gray-800">Register</h1>

          {error && (
            <Alert severity="error" className="text-sm">
              {error}
            </Alert>
          )}

          {successful && (
            <Alert severity="success" className="text-sm">
              {successMessage} (Redirecting in {countdown} seconds)
            </Alert>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                type="text"
                placeholder="example@gmail.com"
                className="block w-full p-3 rounded border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-300 focus:ring-opacity-50"
                onChange={handleEmailInput}
                required
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                <MailOutlineIcon />
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <input
                id="phone"
                type="text"
                placeholder="Phone number"
                className="block w-full p-3 rounded border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-300 focus:ring-opacity-50"
                onChange={handlePhone}
                required
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                <LocalPhoneIcon />
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={passVisibility ? "text" : "password"}
                placeholder="Type your password"
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

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={passVisibility ? "text" : "password"}
                placeholder="Confirm your password"
                className="block w-full p-3 rounded border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-300 focus:ring-opacity-50"
                onChange={handleConfirmPwdInput}
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

          <div className="flex items-center space-x-2">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 text-green-500 focus:ring-green-400 border-gray-300 rounded"
              onChange={handleTermsChange}
              required
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              By signing up, I accept the
              <Link to="" className="text-green-500 underline ml-1">
                Terms of Use
              </Link>
              and
              <Link to="" className="text-green-500 underline ml-1">
                Privacy Policy
              </Link>
              .
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded shadow focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-50 disabled:opacity-50"
            disabled={!termsAccepted || isLoading}
          >
            {isLoading ? <ClipLoader size={20} color="#ffffff" /> : "Sign Up"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-green-500 font-medium hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default RegisterPage;