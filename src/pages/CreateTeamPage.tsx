/* eslint-disable prettier/prettier */
import React from 'react'
import LeftNav from '../components/ui/LeftNav'
import NavBar from '../components/ui/NavBar'
import CreateTeam from '../components/CreateTeam'
import Login from '../components/Login'
import { selectIsAuthenticated } from '../features/auths/authSlice'
import { useAppSelector } from '../app/hooks'

const CreateTeamPage = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  return (
    

<div>
        {isAuthenticated ? (
          <div className="flex gap-1 bg-slate-900 text-white h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
          <div className=" w-1/6">
            <LeftNav />
          </div>
          <div className=" w-full">
            <NavBar />
            <div>
              <CreateTeam />
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

export default CreateTeamPage