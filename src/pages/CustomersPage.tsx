/* eslint-disable prettier/prettier */
import React from 'react'
import LeftNav from '../components/ui/LeftNav'
import NavBar from '../components/ui/NavBar'
import Customers from '../components/Customers'
import { selectIsAuthenticated } from '../features/auths/authSlice'
import { useAppSelector } from '../app/hooks'
import Login from '../components/Login'
import { useMediaQuery } from 'react-responsive'

const CustomersPage = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  return (
    <div>
        {isAuthenticated ? (
          <div className='flex gap-1 bg-slate-900 text-white'>
          <div className=' w-1/6'>
              <LeftNav  />
          </div>
          <div className=' w-full'>
              <NavBar  />
              <div>
                <Customers />
              </div>
          </div>

      </div>
        ) : (
          <div >
            <Login />
          </div>
        )}
      </div>

    
  )
}

export default CustomersPage