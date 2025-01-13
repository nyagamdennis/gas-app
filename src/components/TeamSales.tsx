/* eslint-disable prettier/prettier */
import React, {useEffect} from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { fetchSales, getSalestatus, selectAllSales } from '../features/sales/salesSlice'
import SaleExcerpt from '../features/sales/SaleExcerpt';

const TeamSales = () => {
    const allSales = useAppSelector(selectAllSales);
    const salesStatus = useAppSelector(getSalestatus);


    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchSales())
    }, [dispatch])

    let content;
    if( salesStatus === "loading"){
        content = <div>
            <p>Loading...</p>
        </div>
    } else if( salesStatus === "succeeded"){
        content = allSales.map((sale) => (
            <SaleExcerpt key={sale.id} sales = {sale} />
        ))
    }


  return (
    <div>
        <h3>Team Sales</h3>
        <div>
            {content}
        </div>
    </div>
  )
}

export default TeamSales