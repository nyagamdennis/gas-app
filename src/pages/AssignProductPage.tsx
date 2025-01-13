/* eslint-disable prettier/prettier */
import React from 'react'
import LeftNav from '../components/ui/LeftNav'
import NavBar from '../components/ui/NavBar'
import AssignProducts from '../components/AssignProducts'
import Login from '../components/Login'
import { selectIsAuthenticated } from '../features/auths/authSlice'
import { useAppSelector } from '../app/hooks'

const AssignProductPage = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  return (
    <div>
      {isAuthenticated ? (
        <div className='flex gap-1 bg-slate-900 text-white'>
          <div className=' w-1/6'>
            <LeftNav />
          </div>
          <div className=' w-full'>
            <NavBar />
            <div>
              <AssignProducts />
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

export default AssignProductPage