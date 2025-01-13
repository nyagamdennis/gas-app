// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchMyProfile, selectMyProfile } from '../features/employees/myProfileSlice';
import getApiUrl from '../getApiUrl';
import { selectIsAuthenticated } from '../features/auths/authSlice';
import axios from 'axios';

const UnverifiedPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const myProfile = useAppSelector(selectMyProfile);
    const [errMsg, setErrMsg] = useState("");

    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const apiUrl = getApiUrl();


    useEffect(() => {
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
                    } else if (has_employee_profile && is_verified) {
                        navigate("/sales", {
                            state: { message: "Your profile is not verified. Please contact the admin." },
                        });
                    } else if (!has_employee_profile) {
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
        <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
                <h1 className="text-2xl font-bold text-yellow-600 mb-4">Account Not Verified</h1>
                <p className="text-gray-700 mb-4">
                    Your account is not verified yet. Please contact the administrator to verify your profile and gain access.
                </p>
            </div>
        </div>
    )
}

export default UnverifiedPage