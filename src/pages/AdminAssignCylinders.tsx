import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { fetchSalesTeam, selectAllSalesTeam } from '../features/salesTeam/salesTeamSlice'

const AdminAssignCylinders = () => {
    const dispatch = useAppDispatch();

    const allSalesTeam = useAppSelector(selectAllSalesTeam)

    useEffect(() => {
        dispatch(fetchSalesTeam())
    }, [dispatch])

  return (
    <div>
        {allSalesTeam.map((sales) => (
            <h3>{sales.name}</h3>
        ) )}
    </div>
  )
}

export default AdminAssignCylinders