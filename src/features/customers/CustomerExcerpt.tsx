/* eslint-disable prettier/prettier */
import React, { useState, useRef } from "react"
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk"
import SendIcon from "@mui/icons-material/Send"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { useAppSelector } from "../../app/hooks"
import { selectAllLocations } from "../location/locationSlice"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import { selectAllProducts } from "../product/productSlice"
import { selectAllSales } from "../sales/salesSlice"
import axios from "axios"
import Cookies from "cookies-js"
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import getApiUrl from "../../getApiUrl"

export interface Customer {
  id: number;
  name: string;
  sales: string;
  location: {
    id: number;
    name: string;
  }
  phone: number;
  customer_debt: {
    amount: number;
    expected_date_to_repay: string;
    date_given: string;
  }[]
  customer_sales: {
    id: number;
    product: {
      id: number;
      name: string;
      weight: number;
      timestamp: string;
    }[]
    total_amount: number;
    quantity: number;
  }[]
}

export interface products {
  id: number;
  name: string;
  weight: number;
  timestamp: string;
}

interface CustomerExcerptProps {
  key: number;
  customerId: number; // Include the customerId prop
  customer: Customer
}

const CustomerExcerpt: React.FC<CustomerExcerptProps> = ({key,customerId,customer,}) => {
  const apiUrl = getApiUrl()
  const [showAlert, setShowAlert] = useState(false);
  const [showError, setShowError] = useState(false);

  // const messageInputRef = useRef(null);
  const messageTextareaRef = useRef<HTMLTextAreaElement | null>(null);


  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState();
  const [customers, setCustomers] = useState();


  const handleMessage = (e: any) => setMessage(e.target.value)

  const locations = useAppSelector(selectAllLocations)

  const products = useAppSelector(selectAllProducts)

  const salesProduct = useAppSelector(selectAllSales)

  const [smsState, setSmsState] = useState(false)

  const [showHistory, setShowHistory] = useState(false)

  const showSmsInputs = () => setSmsState(!smsState)

  const showHist = () => setShowHistory(!showHistory)

  const phoneNum = customer.phone
  const phoneStr = phoneNum.toString()

  console.log("Phone string ", phoneStr)

  function formatTimestamp() {
    const date = new Date()
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    })
    return formattedDate
  }

  const formattedDatess =
  customer &&
  customer.customer_debt.map((debt) => {
    const debtDate = new Date(debt.expected_date_to_repay);
    console.log("debt date given ", debtDate);
    const formattedDate = debtDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return formattedDate;
  });


  const formattedDates =
    customer &&
    customer.customer_debt.map((debt) => {
      const debtDate = new Date(debt.expected_date_to_repay)
      const formattedDate = debtDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      return {
        formattedDate,
        isPastDue: debtDate < new Date(),
      }
    })

  const formattedDate =
    customer &&
    customer.customer_debt.map((debt) => {
      const debtDate = new Date(debt.date_given)
      console.log("debt date given ", debtDate)
      const formattedDate = debtDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      return formattedDate
    })

  const locat = locations.find(
    (location) => location.id === customer.location.id,
  )

  const sold = customer.customer_sales
    ? salesProduct.find((sale) =>
        customer.customer_sales.some(
          // @ts-ignore
          (customerSale) => customerSale.product.id === sale.id,
        ),
      )
    : null

  const productName = sold
    ? products.find((product) => product.id === sold.product)?.name
    : "not found"
  const productWeight = sold
    ? products.find((product) => product.id === sold.product)?.weight
    : 0



    const handleSubmit = async (e: any) => {
      e.preventDefault()
  
      setIsSubmitting(true)
  
      try {
        // Create an object with the form data
        const formData = {
          message: message,
          customer: [customer.id],
          location: [customer.location.id],
        }
        const response = await axios.post(
          `${apiUrl}/sendsms/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
              "Content-Type": "application/json",
            },
          },
        )
  
        if (response.status === 201) {
          if (messageTextareaRef.current) {
            messageTextareaRef.current.value = "";
            setShowAlert(true);
            setTimeout(() => {
              setShowAlert(false);
            }, 5000);
            // console.log("Form submitted successfully!");
          }
          // messageTextareaRef.current.value = "";
          // setShowAlert(true);
          // setTimeout(() => {
          //   setShowAlert(false);
          // }, 5000);
          // console.log("Form submitted successfully!");
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
        if (error.response.status === 401) {
          console.error("Error occurred while submitting the form:", error);
          setShowError(true);
          setTimeout(() => {
            setShowError(false);
          }, 5000);
        } else {
          console.error("Error occurred while submitting the form:", error);
        }
    //     console.error("Error occurred while submitting the form:", error);
    //     console.error("Error occurred while submitting the form:", error);
    // console.log("Response data:", error.response.data);
    // console.log("Response status:", error.response.status);
    // console.log("Response headers:", error.response.headers);
      } finally {
        // Reset isSubmitting to enable the submit button
        setIsSubmitting(false);
        setTimeout(() => {
          setSmsState(false);
        }, 6000);
        
      }
    }
  return (
    <div className=" bg-green-400 mx-1 p-3 rounded-sm mb-3 ">
      <div className="flex justify-between  mt-2 cursor-pointer">
        <h5 className=" font-semibold text-xl">{customer.name}</h5>
        <div className=" font-semibold text-lg">
          <PhoneInTalkIcon />
          <span>
            {phoneStr.substring(0, 2)}****{phoneStr.substring(6, 9)}
          </span>
        </div>
        <span>
          <LocationOnIcon />
          {locat?.name}
        </span>
        <div>
          <button
            onClick={showSmsInputs}
            className=" bg-blue-500 px-3 py-1 rounded-sm"
          >
            Message
          </button>
        </div>
        <ExpandMoreIcon onClick={showHist} className=" right-1" />
      </div>
      {smsState && (
        <div className=" mx-auto mt-4">
          <form className=" ms-6 " onSubmit={handleSubmit}>
            <textarea ref={messageTextareaRef} required name={message} onChange={handleMessage}  className=" w-full h-11 text-black p-1 outline-none rounded-sm"></textarea>
            <div className="flex justify-end mt-2">
              <button className=" bg-blue-500 py-1 px-2 flex items-center rounded-md">
                {isSubmitting ?
                ( <Box sx={{ display: 'flex' }}>
                <CircularProgress className=" !text-white" />
              </Box>): (<>Send <SendIcon /></>)
                }
                
              </button>
            </div>
          </form>
          {showAlert && (
        <Stack className=" mt-2" sx={{ width: "100%" }} spacing={2}>
          <Alert severity="success">Message sent successfully!</Alert>
        </Stack>
      )}

      {showError && (
        <Stack className=" mt-2" sx={{ width: "100%" }} spacing={2}>
          <Alert severity="error">Please Log in!</Alert>
        </Stack>
        
      )}
        </div>
      )}

      {showHistory && (
        <div className="">
          <h5 className=" font-semibold text-zinc-950 text-lg">
            Customer Details
          </h5>
          <div>
            {customer.customer_debt.length > 0 && (
              <div className=" bg-red-400 text-bold">
                <span>Customer Debts:</span>
                <div>
                  <div className=" ">
                    {/* <span className=" me-3">Given on: </span>{" "} */}
                    {customer.customer_debt.map((debt, index) => (
                      <div
                        key={index}
                        className={
                          formattedDates[index].isPastDue
                            ? " bg-red-950 flex gap-2 "
                            : "flex gap-2"
                        }
                      >
                        <span>Given on: {formattedDate[index]}</span>
                        <span className=" flex items-center gap-3 ">
                          {/* {" "} */}
                          Amount:{" "}
                          <div className=" text-lg font-bold">
                            Ksh{debt.amount}
                          </div>
                        </span>
                        <span>Due: {formattedDatess[index]}</span>
                      </div>
                    ))}
                  </div>
                  
                </div>
              </div>
            )}
          </div>
          <div className="mt-1 bg-green-800 p-1 rounded-sm">
            <h2 className=" text-lg">Purchase History</h2>
            {customer.customer_sales.length > 0 && (
              <div>
                {customer.customer_sales.map((sale, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{
                    // @ts-ignore
                    sale.product.cylinder.gas_type.name}</span>
                    <span>{
                    // @ts-ignore
                    sale.product.cylinder.weight.weight} (Kg)</span>
                    <span>Quantity: {sale.quantity}</span>
                    <span>Ksh. {sale.total_amount}</span>
                    <span>{formatTimestamp(
                      // @ts-ignore
                      sale.timestamp)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerExcerpt
