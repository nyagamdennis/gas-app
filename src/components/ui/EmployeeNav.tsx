import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import defaultProfile from "../media/default.png"


const EmployeeNav = ({salesTeamName, myProfile}:{salesTeamName:string; myProfile:any}) => {
    
    return (
        <div className="bg-blue-600 text-white py-4 shadow-md flex justify-between items-center px-6">
                <div>
                    <h1 className="text-3xl font-bold">{salesTeamName}</h1>
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
    );
}

export default EmployeeNav;
