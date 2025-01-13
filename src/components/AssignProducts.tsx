/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  fetchSalesTeam,
  selectAllSalesTeam,
} from "../features/salesTeam/salesTeamSlice"
import {
  fetchProducts,
  selectAllProducts,
} from "../features/product/productSlice"
import axios from "axios"
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import SendIcon from '@mui/icons-material/Send';
import Cookies from 'cookies-js';
import getApiUrl from "../getApiUrl"

const AssignProducts = () => {
  const apiUrl = getApiUrl()
  const [selectedSalesTeam, setSelectedSalesTeam] = useState("");
  const [selectCylinder, setSelectedCylinder] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showError, setShowError] = useState(false);
  const quantityRef = useRef<HTMLInputElement | null>(null);

  const allSales = useAppSelector(selectAllSalesTeam);

  const cylinders = useAppSelector(selectAllProducts);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchSalesTeam())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    setIsSubmitting(true)

    try {
      // Create an object with the form data
      const formData = {
        sales_team: selectedSalesTeam,
        cylinder: selectCylinder,
        assigned_quantity: quantityRef.current?.value,
      }
      
      console.log("Form Data here ", formData)
      const response = await axios.post(
        `${apiUrl}/addassignedcylinder/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
            "Content-Type": "application/json",
          },
        },
      )

      // if (response.status === 201) {
      //   setShowAlert(true);
      //   messageTextareaRef.current?.value = "";
      //   setTimeout(() => {
      //     setShowAlert(false);
      //   }, 5000);
      //   console.log("Form submitted successfully!");
      if (response.status === 201) {
        setShowAlert(true)
        // messageTextareaRef.current.value = "";
        if (quantityRef.current) {
          quantityRef.current.value = ""
        }
        setTimeout(() => {
          setShowAlert(false)
        }, 5000)
        console.log("Form submitted successfully!")
      } else {
        // Handle specific error status codes
        if (response.status === 400) {
          console.error("Bad Request: The submitted data is invalid")
        } else if (response.status === 401) {
          console.error("Unauthorized: User is not authenticated")
        } else {
          console.error("Form submission failed with status:", response.status)
        }
      }
    } catch (error: any) {
      if (error.response === 401) {
        console.error("Error occurred while submitting the form:", error)
        setShowError(true)
        setTimeout(() => {
          setShowError(false)
        }, 5000)
      } else {
        console.error("Error occurred while submitting the form:", error)
      }
      //     console.error("Error occurred while submitting the form:", error);
      //     console.error("Error occurred while submitting the form:", error);
      // console.log("Response data:", error.response.data);
      // console.log("Response status:", error.response.status);
      // console.log("Response headers:", error.response.headers);
    } finally {
      // Reset isSubmitting to enable the submit button
      setIsSubmitting(false)
      // setTimeout(() => {
      //   setSmsState(false);
      // }, 6000);
    }
  }

  return (
    <div className="px-3">
      <div>
        <form onSubmit={handleSubmit} className=" flex flex-col items-center">
          <label>Select Sales Team</label>
          <select
            name="sales_team"
            id="salesTeam"
            className="text-black outline-none rounded-sm"
            onChange={(e) => {
              if (e.target.value === "") {
                setSelectedSalesTeam("all")
              } else {
                setSelectedSalesTeam(e.target.value)
              }
            }}
          >
            <option></option>

            {allSales.map((sales) => (
              <option key={sales.id} value={sales.id}>
                {sales.name}
              </option>
            ))}
          </select>
          <label>Cylinder</label>
          <select
            className="text-black outline-none rounded-sm"
            onChange={(e) => {
              setSelectedCylinder(e.target.value)
            }}
          >
            <option></option>
            {cylinders.map((cylinder) => (
              <option key={cylinder.id} value={cylinder.gas_type.id}>
                {cylinder.gas_type.name} {cylinder.weight.weight}Kg
              </option>
            ))}
          </select>
          <label>Quantity</label>
          <input type="number" className=" text-black outline-none px-2" ref={quantityRef} required />
          <button className=" bg-slate-300 ">
          {isSubmitting ?
                ( <Box sx={{ display: 'flex' }}>
                <CircularProgress className=" !text-white" />
              </Box>): (<>Assign <SendIcon /></>)
                }
                
          </button>
        </form>
      </div>
    </div>
  )
}

export default AssignProducts
