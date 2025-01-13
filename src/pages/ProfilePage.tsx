/* eslint-disable prettier/prettier */
import React from 'react'
import Profile from '../components/Profile'
import NavBar from '../components/ui/NavBar'
import LeftNav from '../components/ui/LeftNav'

const ProfilePage = () => {
  return (
    <div className='flex gap-1 bg-slate-900 text-white h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200'>
            <div className=' w-1/6'>
                <LeftNav  />
            </div>
            <div className=' w-full'>
                <NavBar  />
                <div>
                    <Profile />
                </div>
            </div>

        </div>
  )
}

export default ProfilePage