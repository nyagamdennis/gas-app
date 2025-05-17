import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import defaultProfile from "../media/default.png"
import MenuIcon from '@mui/icons-material/Menu';
import RightNav from "../RightNav"
import EmployeeRightNav from './EmployeeRightNav';



const EmployeeNav = ({headerMessage, headerText, myProfile}:{headerMessage: string; headerText: string; myProfile:any}) => {
    const [navOpen, setNavOpen] = useState(false)
    
    return (
        <div className="relative">
      {/* Header with toggle button */}
      <header className="bg-white/80 backdrop-blur-md shadow-md border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{headerMessage}</h1>
          <p className="text-sm text-gray-500 mt-1">{headerText}</p>
        </div>
        <button
          onClick={() => setNavOpen(true)}
          className="p-2 text-gray-700 hover:text-black focus:outline-none"
          aria-label="Open menu"
        >
          <MenuIcon />
        </button>
      </header>

    

      {/* RightNav Drawer */}
      <EmployeeRightNav myProfile={myProfile} isOpen={navOpen} onClose={() => setNavOpen(false)} />
    </div>


        
    );
}

export default EmployeeNav;
