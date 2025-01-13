/* eslint-disable prettier/prettier */
import React from 'react'
import LeftNav from '../components/ui/LeftNav'
import NavBar from '../components/ui/NavBar'
import OverdueDebtors from '../components/OverdueDebtors'

const OverDueDebtorsPage = () => {
  return (
    <div className='flex gap-1 bg-slate-900 text-white'>
            <div className=' w-1/6'>
                <LeftNav  />
            </div>
            <div className=' w-full'>
                <NavBar  />
                <div>
                    <OverdueDebtors  />
                </div>
            </div>

        </div>
  )
}

export default OverDueDebtorsPage


