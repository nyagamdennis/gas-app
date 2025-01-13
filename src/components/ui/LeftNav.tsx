/* eslint-disable prettier/prettier */
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddIcon from '@mui/icons-material/Add';
import InventoryIcon from '@mui/icons-material/Inventory';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SpaIcon from '@mui/icons-material/Spa';
import { Link, NavLink } from 'react-router-dom';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import BadgeIcon from '@mui/icons-material/Badge';

const LeftNav = () => {
    return (
        <div className=' bg-slate-600 pt-2  h-screen left-0 sticky'>
            <h1 className=' font-extrabold mb-3 px-2'>BARAKA GAS POINT</h1>
            <div>
                <ul className='flex flex-col space-y-5'>
                    <li>
                        <NavLink
                            to='/'
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2 ${isActive ? 'bg-red-100 text-amber-700' : ''}`
                            }
                        >
                            <DashboardIcon />
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to='/store'
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2 ${isActive ? 'bg-red-100 text-amber-700' : ''}`
                            }
                        >
                            <InventoryIcon />
                            Store
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to='/sendsms'
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2 ${isActive ? 'bg-red-100 text-amber-700' : ''}`
                            }
                        >
                            <ChatBubbleOutlineIcon />
                            Send SMS
                        </NavLink>

                    </li>
                    <li>
                        <NavLink
                            to='/customers'
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2 ${isActive ? 'bg-red-100 text-amber-700' : ''}`
                            }
                        >
                            <SpaIcon />
                            Customers
                        </NavLink>
                    </li>
                    {/* <li>
                        <NavLink
                            to='/assign'
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2 ${isActive ? 'bg-red-100 text-amber-700' : ''}`
                            }
                        >
                            <AssignmentTurnedInIcon />Assign Products
                        </NavLink>
                    </li> */}
                    <li>
                        <NavLink
                            to='/createteam'
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2 ${isActive ? 'bg-red-100 text-amber-700' : ''}`
                            }
                        >
                            <AssignmentTurnedInIcon />Create Team
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to='/employees'
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2 ${isActive ? 'bg-red-100 text-amber-700' : ''}`
                            }
                        >
                            <BadgeIcon />Employees
                        </NavLink>
                    </li>

                </ul>
            </div>
        </div>
    )
}

export default LeftNav