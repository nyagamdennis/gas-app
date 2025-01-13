/* eslint-disable prettier/prettier */
import Badge from "@mui/material/Badge"
import MailIcon from "@mui/icons-material/Mail"
// import logo from "../images/kateryna-hliznitsova-U5m-nwd9gDY-unsplash.jpg"
import { Link } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import { logout, selectIsAuthenticated } from "../../features/auths/authSlice"
import { useDispatch } from "react-redux"
import { useState } from "react"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const NavBar = () => {
  const [show, setShow] = useState(false);
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  const user = useAppSelector((state) => state.auth.user)

  const dispatch = useDispatch();

  const handleLogout = () => {
    // @ts-ignore
    dispatch(logout())
  }

  const showProc = () => setShow(!show)

  return (
    <div className=" sticky top-0">
      <nav className="flex justify-between px-3 h-10  items-center py-4 rounded-sm bg-slate-600  mx-3 my-2">
        <div>
          <input
            placeholder="search.."
            className=" rounded-lg text-white flex-1 bg-slate-700 outline-none px-1 "
          />
        </div>
        <div className="flex items-center gap-3">
          <div className=" cursor-pointer">
            <Badge badgeContent={7} color="primary">
              <MailIcon className=" text-white" />
            </Badge>
          </div>
          <div>
            {isAuthenticated ? (
              <div className="relative" onClick={showProc}>
                <div className="flex items-center gap-3">
                  <h5 className="text-sm font-semibold underline cursor-pointer">
                    
                    @{
                      // @ts-ignore
                    user?.email}
                  </h5>
                  <AccountCircleIcon />
                  {/* <img
                    className="h-10 w-10 rounded-full object-contain cursor-pointer"
                    src={logo}
                    alt="logo"
                  /> */}
                </div>
                {show && (
                  <div className="absolute top-10 right-0 bg-white border border-gray-300 rounded-lg py-2 px-4 shadow-md">
                    <Link
                      to="/profile"
                      className="block text-black mb-2 border-b-2"
                    >
                      Profile
                    </Link>
                    <button className=" text-black" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className=" text-lg">
                  <button>Login</button>
                </Link>
                <Link to="/register" className=" text-lg">
                  <button>Register</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  )
}

export default NavBar
