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

  const handleEmailInput = (e: any) => setEmail(e.target.value);
  const handlePhone = (e: any) => setPhone(e.target.value);
  const handlePwdInput = (e: any) => setPassword(e.target.value);
  const handleConfirmPwdInput = (e: any) => setConfirmPassword(e.target.value);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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

      // Reset form and set success
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setPhone("");
      setError("");
      setLoading(false);
      setSuccess(true);
      setSuccessMessage("Registration successful! Redirecting to login...");

      // Countdown before redirection
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
    } catch (error: any) {
      setLoading(false);
      setSuccess(false);
      setError(
        error.response?.data?.detail || "An error occurred during registration."
      );
    }
  };

  const handlePasswordVisisbility = () => {
    setPasswordVisibility(!passVisibility);
  };

  return (
    <section className="h-screen bg-gradient-to-br from-green-500 to-white flex items-center justify-center">
      <div className="bg-gray-500 p-8 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-2xl font-bold text-center mb-6">Register</p>
          <div className="error-div">
            {error && (
              <div className="popup">
                <Alert severity="error">{error}</Alert>
              </div>
            )}
            {successful && (
              <div className="popup">
                <Alert severity="success">
                  {successMessage} (Redirecting in {countdown} seconds)
                </Alert>
              </div>
            )}
          </div>
          <div>
            <label className="block mb-2">Email*</label>
            <div className="input-group mb-3 flex items-center bg-white rounded">
              <span className="input-group-text p-2 bg-gray-100 rounded-l">
                <MailOutlineIcon />
              </span>
              <input
                type="text"
                placeholder="example@gmail.com"
                name="email"
                className="form-control p-2 flex-grow rounded-r outline-none"
                onChange={handleEmailInput}
                required
              />
            </div>
          </div>
          <div>
            <label className="block mb-2">Phone Number*</label>
            <div className="input-group mb-3 flex items-center bg-white rounded">
              <span className="input-group-text p-2 bg-gray-100 rounded-l">
                <LocalPhoneIcon />
              </span>
              <input
                type="text"
                placeholder="Phone number"
                name="phone"
                className="form-control p-2 flex-grow rounded-r outline-none"
                onChange={handlePhone}
                required
              />
            </div>
          </div>
          <div>
            <label className="block mb-2">Password*</label>
            <div className="input-group mb-3 flex items-center bg-white rounded">
              <span className="input-group-text p-2 bg-gray-100 rounded-l">
                <LockIcon />
              </span>
              <input
                type={passVisibility ? "text" : "password"}
                placeholder="Type your password"
                name="password"
                className="form-control p-2 flex-grow rounded-r outline-none"
                onChange={handlePwdInput}
                required
              />
              <span
                onClick={handlePasswordVisisbility}
                className="!bg-white cursor-pointer pe-1"
              >
                {passVisibility ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </span>
            </div>
          </div>

          <div>
            <label className="block mb-2">Confirm Password*</label>
            <div className="input-group mb-3 flex items-center bg-white rounded">
              <span className="input-group-text p-2 bg-gray-100 rounded-l">
                <LockIcon />
              </span>
              <input
                type={passVisibility ? "text" : "password"}
                placeholder="Type your password"
                name="password"
                className="form-control p-2 flex-grow rounded-r outline-none"
                onChange={handleConfirmPwdInput}
                required
              />
              <span
                onClick={handlePasswordVisisbility}
                className="!bg-white cursor-pointer pe-1"
              >
                {passVisibility ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </span>
            </div>
          </div>

          <div className="form-check-inline">
            <p className="terms-text">
              <input
                type="checkbox"
                name="terms"
                className="cursor-pointer"
                required
              />{" "}
              By signing up to create an account, I accept the company's{" "}
              <Link className="text-link-color font-bold" to="">
                Terms of Use
              </Link>{" "}
              and{" "}
              <Link className="text-link-color font-bold" to="">
                Privacy Policy
              </Link>
            </p>
          </div>
          <div>
            <button
              className="w-full bg-gradient-to-r from-green to-yellow font-bold cursor-pointer text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              {isLoading ? <ClipLoader size={15} color={"#ffffff"} /> : "Sign Up"}
            </button>
          </div>
          <div>
            <p className="flex justify-end">
              Already have an account?{" "}
              <Link className="text-link-color font-bold" to="/login">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default RegisterPage;
