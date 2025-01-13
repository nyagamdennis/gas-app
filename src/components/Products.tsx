/* eslint-disable prettier/prettier */
import React, { useEffect } from "react"
import ShortCuts from "./ShortCuts"
import MakeSales from "./MakeSales"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { fetchCustomers } from "../features/customers/customerSlice"
import { fetchDebtors } from "../features/debtors/debtorsSlice"
import { fetchProducts } from "../features/product/productSlice"
import { fetchSales } from "../features/sales/salesSlice"
import { fetchSalesTeamManagement, getSalesTeamManagementStatus,  selectAllSalesTeamManagement } from "../features/salesTeam/salesTeamManagementSlice"


// Sample data representing LPG gas cylinders from different companies


const Products = () => {
  const allTeams = useAppSelector(selectAllSalesTeamManagement);
  const allTeamsStatus = useAppSelector(getSalesTeamManagementStatus)
  const dispatch = useAppDispatch()


  useEffect(() => {
    dispatch(fetchCustomers())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchDebtors())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])


  useEffect(() => {
    dispatch(fetchSales())
  }, [dispatch])


  useEffect(() => {
    dispatch(fetchSalesTeamManagement())
  }, [dispatch])


  
  let content;
  
  if (allTeamsStatus === "loading"){
    content = <h1>Loading...</h1>
  } else if ( allTeamsStatus === "succeeded"){
    content = allTeams.map((team) => (
      <MakeSales key={team.id} team={team} />
    ))
  }

  return (
    <div>      
      <ShortCuts />
      {content}
     
    </div>
  )
}

export default Products