/* eslint-disable prettier/prettier */
import React from 'react'
import LeftNav from '../components/ui/LeftNav'
import NavBar from '../components/ui/NavBar'
import AddCustomer from '../components/AddCustomer'
import { useAppSelector } from '../app/hooks'
import { selectIsAuthenticated } from '../features/auths/authSlice'
import Login from '../components/Login'
import { useMediaQuery } from 'react-responsive'

const AddCustomerPage = () => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated)
    const isDesktopOrLaptop = useMediaQuery({
        query: '(min-width: 1224px)'
      })
  return (
    <div>

    {isAuthenticated ? (
      <div className='flex gap-1 bg-slate-900 text-white h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200'>
      <div className=' w-1/6'>
          <LeftNav  />
      </div>
      <div className=' w-full'>
          <NavBar  />
          <div>
              <AddCustomer />
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

export default AddCustomerPage