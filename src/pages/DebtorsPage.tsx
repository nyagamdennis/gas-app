/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable prettier/prettier */
import React from 'react'
import Debtors from '../components/Debtors'
import LeftNav from '../components/ui/LeftNav'
import NavBar from '../components/ui/NavBar'

const DebtorsPage = () => {
  return (
    <div className='flex gap-1 bg-slate-900 text-white'>
            <div className=' w-1/6'>
                <LeftNav  />
            </div>
            <div className=' w-full'>
                <NavBar  />
                <div>
                    <Debtors  />
                </div>
            </div>

        </div>
  )
}

export default DebtorsPage