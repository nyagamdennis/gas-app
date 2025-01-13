/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
// @ts-ignore
import React, { useEffect, useState } from "react"
import ShortCuts from "./ShortCuts"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import AddIcon from "@mui/icons-material/Add"
import axios from "axios"
import Cookies from "cookies-js"
import SaveAsIcon from '@mui/icons-material/SaveAs';
import {
  fetchCustomers,
  getCustomerError,
  getCustomersStatus,
  selectAllCustomers,
} from "../features/customers/customerSlice"
import CustomerExcerpt from "../features/customers/CustomerExcerpt"
import {
  fetchLocations,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  selectAllLocations,
} from "../features/location/locationSlice"
import { fetchProducts } from "../features/product/productSlice"
import { fetchSales } from "../features/sales/salesSlice"
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Alert } from "@mui/material"
import getApiUrl from "../getApiUrl"

const Customers = () => {
  const customers = useAppSelector(selectAllCustomers)
  const customerStatus = useAppSelector(getCustomersStatus)
  const customerError = useAppSelector(getCustomerError)
  const [searchInput, setSearchInput] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [addRetailCustomer, setAddRetailCustomer] = useState(false)
  const [addWholeSaleCustomer, setAddWholeSaleCustomer] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [showError, setShowError] = useState(false)

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const apiUrl = getApiUrl()
  // const handleSearchInputChange = (event:any) => {
  //   setSearchInput(event.target.value);
  // };

  const filterCustomers = (searchText: any) => {
    return customers.filter((customer) => {
      const nameMatch = customer.name
        .toLowerCase()
        .includes(searchText.toLowerCase())
      const phoneMatch = customer.phone.toString().includes(searchText)
      return nameMatch || phoneMatch
    })
  }

  const filteredCustomers = filterCustomers(searchInput)

  const handleSHowAddRetailCustomer = () => setAddRetailCustomer(!addRetailCustomer)
  const handleSHowAddWholeSaleCustomer = () => setAddWholeSaleCustomer(!addWholeSaleCustomer)


  const handleSearchInputChange = (event: any) => {
    const searchText = event.target.value
    setSearchInput(searchText)

    const filteredCustomers = filterCustomers(searchText)
    // @ts-ignore
    setSearchResults(filteredCustomers)
  }

  // console.log("results ", filteredCustomers)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchCustomers())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchLocations())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchSales())
  }, [dispatch])

  let retail_content
  let wholesale_content
  if (customerStatus === "loading") {
    wholesale_content = <div>loading...</div>
    retail_content = <div>loading...</div>
  } else if (customerStatus === "succeeded") {
    const retail_customers = customers.filter(
      (retails) => retails.sales === "RETAIL",
    )
    const wholesale_customers = customers.filter(
      (retails) => retails.sales === "WHOLESALE",
    )
    // console.log("retails ", retail_customers)
    // console.log("wholesale ", wholesale_customers)
    retail_content = retail_customers.map((customer) => (
      <CustomerExcerpt
        key={customer.id}
        customerId={customer.id}
        // @ts-ignore
        customer={customer}
      />
    ))
    wholesale_content = wholesale_customers.map((customer) => (
      <CustomerExcerpt
        key={customer.id}
        customerId={customer.id}
        // @ts-ignore
        customer={customer}
      />
    ))
  }

  // const filterCustomers = (searchText) => {
  //   return customers.filter((customer) => {
  //     const nameMatch = customer.name.toLowerCase().includes(searchText.toLowerCase());
  //     const phoneMatch = customer.phone.toString().includes(searchText);
  //     return nameMatch || phoneMatch;
  //   });
  // };

  const handleRetailSubmit = async (e: any) => {
    console.log('Am called to add retail customer!')
    e.preventDefault()

    setIsSubmitting(true)

    try {
      const formData = {
        sales: "RETAIL",
        name: name,
        phone: phone,
        location: {name: location}
      }
      console.log('Save this data ', formData)
      const response = await axios.post(
        `${apiUrl}/addcustomer/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
            "Content-Type": "application/json",
          },
        },
      )

      console.log('Made a request already!')
      if (response.status === 201) {

        dispatch(fetchCustomers());
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 5000);
       
      } else {
        console.log('Error here!')
        if (response.status === 400) {
          console.error("Bad Request: The submitted data is invalid");
        } else if (response.status === 401) {
          console.error("Unauthorized: User is not authenticated");
        } else {
          console.error("Form submission failed with status:", response.status);
        }
      }
    } catch (error:any) {
      if (error.response.status === 401) {
        console.error("Error occurred while submitting the form:", error);
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
      } else {
        console.error("Error occurred while submitting the form:", error);
      }

    } finally {
      setName("");
        setPhone("");
        setLocation("");
      setIsSubmitting(false);
      setTimeout(() => {
        setAddRetailCustomer(false);
      }, 6000);
      
    }
  }
  const handleWholeSaleSubmit = async (e: any) => {
    e.preventDefault()

    setIsSubmitting(true)

    try {
      // Create an object with the form data
      const formData = {
        sales: "WHOLESALE",
        name: name,
        phone: phone,
        location: {name:location}
      }
      const response = await axios.post(
        `${apiUrl}/addcustomer/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (response.status === 201) {
          dispatch(fetchCustomers())
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 5000);
        setName("");
        setPhone("");
        setLocation("");
       
      } else {
        // Handle specific error status codes
        if (response.status === 400) {
          console.error("Bad Request: The submitted data is invalid");
        } else if (response.status === 401) {
          console.error("Unauthorized: User is not authenticated");
        } else {
          console.error("Form submission failed with status:", response.status);
        }
      }
    } catch (error:any) {
      if (error.response === 401) {
        console.error("Error occurred while submitting the form:", error);
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
      } else {
        console.error("Error occurred while submitting the form:", error);
      }
    } finally {
      
      setIsSubmitting(false);
      setTimeout(() => {
        setAddWholeSaleCustomer(false);
      }, 6000);
      
    }
  }

  return (
    <div>
      <ShortCuts />
      <div className="mt-5 mx-3 flex flex-col space-y-3">
        <h1 className=" font-extrabold text-2xl">Customers</h1>
        <div className=" grid grid-cols-2 gap-4 h-96">
          <div className=" bg-gray-500 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
            <h4 className=" text-xl font-bold underline mb-3">
              Retail Customers
            </h4>
            <div className=" flex justify-between">
              <form onSubmit={handleSearchInputChange}>
                <div className=" flex">
                  <input
                    type="text"
                    placeholder="search customer.."
                    className="ms-1 mb-2 outline-none text-black px-1"
                    required
                  />
                  <button className=" bg-slate-400 px-2 h-6 ">search</button>
                </div>
              </form>
              <div
                className="flex items-center cursor-pointer"
                onClick={handleSHowAddRetailCustomer}
              >
                <p>Add Retail Customer</p>
                <AddIcon className=" " />
              </div>
            </div>
            {addRetailCustomer && (
              <div>
                <form className=" flex gap-2 px-1 mb-2 flex-wrap" onSubmit={ handleRetailSubmit}>
                  <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                    placeholder="Customer Name"
                    type="text"
                    className=" outline-none px-2 text-gray-600 rounded-sm py-0.5"
                    required
                  />
                  <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone Number"
                    type="number"
                    className=" outline-none px-2 rounded-sm text-gray-600 py-0.5"
                    required
                  />
                  <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location"
                    type="text"
                    className=" outline-none rounded-sm px-2 text-gray-600 py-0.5"
                    required
                  />
                 
                  <button className=" bg-blue-500 py-1 px-2 flex items-center rounded-md">
                {isSubmitting ?
                ( <Box sx={{ display: 'flex' }}>
                <CircularProgress className=" !text-white" />
              </Box>): (<>Add <SaveAsIcon /></>)
                }
                
              </button>
                </form>
                { showAlert && (
                  <Alert severity="success" className=" mb-2">Successfully Added the Customer!</Alert>
                )}
                { showError && (
                  <Alert severity="error" className=" mb-2">There was an error, try again!</Alert>
                )}
                
              </div>
            )}

            {retail_content}
          </div>
          <div className=" bg-gray-500 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
            <h4 className=" text-xl font-bold underline mb-3">
              WholeSale Customers
            </h4>

            {/* <div className=" flex">
              <input
                type="text"
                placeholder="search customer.."
                className="ms-1 mb-2 outline-none text-black px-1"
              />
              <button className=" bg-slate-400 px-2 h-6 ">search</button>
            </div> */}
            <div className=" flex justify-between">
              <form onSubmit={handleSearchInputChange}>
                <div className=" flex">
                  <input
                    type="text"
                    placeholder="search customer.."
                    className="ms-1 mb-2 outline-none text-black px-1"
                    required
                  />
                  <button className=" bg-slate-400 px-2 h-6 ">search</button>
                </div>
              </form>
              <div
                className="flex items-center cursor-pointer"
                onClick={handleSHowAddWholeSaleCustomer}
              >
                <p>Add a Wholesale Customer</p>
                <AddIcon className=" " />
              </div>
            </div>
            {addWholeSaleCustomer && (
              <div>
                <form className=" flex gap-2 px-1 mb-2 flex-wrap" onSubmit={ handleWholeSaleSubmit}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                    placeholder="Customer Name"
                    type="text"
                    className=" outline-none px-2 text-gray-600 rounded-sm py-0.5"
                    required
                  />
                  <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone Number"
                    type="number"
                    className=" outline-none px-2 rounded-sm text-gray-600 py-0.5"
                    required
                  />
                  <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location"
                    type="text"
                    className=" outline-none rounded-sm px-2 text-gray-600 py-0.5"
                    required
                  />
                  <button className=" bg-blue-500 py-1 px-2 flex items-center rounded-md">
                {isSubmitting ?
                ( <Box sx={{ display: 'flex' }}>
                <CircularProgress className=" !text-white" />
              </Box>): (<>Add <SaveAsIcon /></>)
                }
                
              </button>
                </form>
                { showAlert && (
                  <Alert severity="success" className=" mb-2">Successfully Added the Customer!</Alert>
                )}
                { showError && (
                  <Alert severity="error" className=" mb-2">There was an error, try again!</Alert>
                )}
              </div>
            )}
            {wholesale_content}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Customers
