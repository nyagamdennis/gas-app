// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchMyProfile, selectMyProfile } from "../features/employees/myProfileSlice";
import defaultProfile from "../components/media/default.png";
import { selectIsAuthenticated } from "../features/auths/authSlice";
import axios from "axios";
import Cookies from "cookies-js";
import getApiUrl from "../getApiUrl";

const SalesRecordPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [errMsg, setErrMsg] = useState("");
  const myProfile = useAppSelector(selectMyProfile);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const apiUrl = getApiUrl();

  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);

  useEffect(() => {
    console.log('running here!')
    if (isAuthenticated) {
      // Check user's status after login
      const checkUserStatus = async () => {
        try {
          const response = await axios.get(`${apiUrl}/check-user-status/`, {
            headers: {
              Authorization: `Bearer ${document.cookie.split("accessToken=")[1]}`,
            },
          });

          const {
            has_employee_profile,
            is_verified,
            is_admin,
          } = response.data;

          if (is_admin) {
            console.log("is admin");
            navigate("/", { state: { message: "Welcome, Admin!" } });
          } else if (has_employee_profile && !is_verified) {
            console.log("is not verified");
            navigate("/unverified", {
              
              state: { message: "Your profile is not verified. Please contact the admin." },
            });
          } else if (!has_employee_profile) {
            console.log("is create profile");
            navigate("/createprofile", {
              state: { message: "Please create your employee profile to continue." },
            });
          }
        } catch (error) {
          setErrMsg("Failed to verify user status. Please try again.");
        }
      };

      checkUserStatus();
    }
  }, [isAuthenticated, navigate, apiUrl]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-blue-600 text-white py-4 shadow-md flex justify-between items-center px-6">
        <div>
          <h1 className="text-3xl font-bold">{myProfile?.sales_team?.name}</h1>
          <p className="mt-1 text-sm">Make sales the easy way.</p>
        </div>
        <Link to="/myprofile" className="flex items-center space-y-2 flex-col">
          <img
            src={myProfile.profile_image || defaultProfile}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          />
          <span className="text-white text-sm">{myProfile.first_name} {myProfile.last_name}</span>
        </Link>
      </div>
      <div className="flex-grow p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/salesteamcylinders" className="bg-white hover:bg-blue-50 border border-blue-500 text-blue-600 rounded-lg shadow-lg flex flex-col justify-center items-center p-6 transition duration-30 ease-in-out">
          <h3 className="text-xl font-semibold">Cylinders</h3>
          <p className="mt-2 text-sm">Check your assigned Cylinders.</p>
        </Link>
        <Link to="/wholesalesrecord" className="bg-white hover:bg-blue-50 border border-blue-500 text-blue-600 rounded-lg shadow-lg flex flex-col justify-center items-center p-6 transition duration-30 ease-in-out">
          <h3 className="text-xl font-semibold">WholeSale</h3>
          <p className="mt-2 text-sm">Record wholesales only.</p>
        </Link>
        <Link to="/retailsalesrecord" className="bg-white hover:bg-blue-50 border border-blue-500 text-blue-600 rounded-lg shadow-lg flex flex-col justify-center items-center p-6 transition duration-30 ease-in-out">
          <h3 className="text-xl font-semibold">Retail</h3>
          <p className="mt-2 text-sm">Record retail sales only.</p>
        </Link>
        <Link to="/otherproducts" className="bg-white hover:bg-blue-50 border border-blue-500 text-blue-600 rounded-lg shadow-lg flex flex-col justify-center items-center p-6 transition duration-30 ease-in-out">
          <h3 className="text-xl font-semibold">Other products sales.</h3>
          <p className="mt-2 text-sm">Record sales of burners, grills, etc.</p>
        </Link>
        <Link to="/teamsales" className="bg-white hover:bg-blue-50 border border-blue-500 text-blue-600 rounded-lg shadow-lg flex flex-col justify-center items-center p-6 transition duration-30 ease-in-out">
          <h3 className="text-xl font-semibold">Sales Record</h3>
          <p className="mt-2 text-sm">View your sales records.</p>
        </Link>
      </div>
      <div className="bg-blue-600 text-white py-3 text-center shadow-inner">
        <Link className="hover:underline" to="/sales">Home</Link>
      </div>
    </div>
  );
};

export default SalesRecordPage;
