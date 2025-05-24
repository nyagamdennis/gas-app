// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchMyProfile, selectMyProfile } from '../features/employees/myProfileSlice';
import { logout, selectIsAuthenticated } from '../features/auths/authSlice';
import axios from 'axios';
import Person2Icon from '@mui/icons-material/Person2';

const UnverifiedPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const myProfile = useAppSelector(selectMyProfile);
    const [errMsg, setErrMsg] = useState("");

    const isAuthenticated = useAppSelector(selectIsAuthenticated);

   
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