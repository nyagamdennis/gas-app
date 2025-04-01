// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchMyProfile, selectMyProfile } from '../features/employees/myProfileSlice';
import getApiUrl from '../getApiUrl';
import { logout, selectIsAuthenticated } from '../features/auths/authSlice';
import axios from 'axios';
import Person2Icon from '@mui/icons-material/Person2';

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
                            state: { message: "Your profile is verified." },
                        });
                    } else if (!has_employee_profile) {
                        navigate("/createprofile", {
                            state: { message: "Please create your employee profile to continue." },
                        });
                    }
                } catch (error) {
                    if (error.response?.status === 401) {
                        // Call the logout function if the status code is 401
                        console.log("Unauthorized user. Logging out...");
                        dispatch(logout());
                    } else {
                        setErrMsg("Failed to verify user status. Please try again.");
                        dispatch(logout());
                    }
                }
            };
    // in res i dont have the layout, i only have drawable, mitmap, values, and xml
            checkUserStatus();
        }
    }, [isAuthenticated, navigate, apiUrl, dispatch]); // Include dispatch in the dependency array

    return (
        <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
                <h1 className="text-2xl font-bold text-yellow-600 mb-4">Account Not Verified</h1>
                <p className="text-gray-700 mb-4">
                    Your account is not verified yet. Please contact the administrator to verify your profile and gain access.
                </p>
                <div className=''>
                    <Link to='/myprofile'>
                    <Person2Icon className='' />
                    <p>View Profile</p>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default UnverifiedPage