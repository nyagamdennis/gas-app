/* eslint-disable prettier/prettier */
import SendIcon from '@mui/icons-material/Send';
import ShortCuts from './ShortCuts'
import RightContent from './RightContent';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchLocations, selectAllLocations } from '../features/location/locationSlice';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Cookies from 'cookies-js';
import getApiUrl from '../getApiUrl';


const SendSms: React.FC = () => {
  const apiUrl = getApiUrl()
  const messageTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const locations = useAppSelector(selectAllLocations);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showError, setShowError] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchLocations())
  }, [dispatch])


  const handleSubmit = async (e: any) => {
    e.preventDefault()

    setIsSubmitting(true)

    try {
      // Create an object with the form data
      const formData = {
        selected_group: selectedGroup,
        selected_location: selectedLocation,
        message: messageTextareaRef.current?.value,
      }
      console.log('selected_location', formData)
      const response = await axios.post(
        `${apiUrl}/sendbulksms/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
            "Content-Type": "application/json",
          },
        },
      )
      if (response.status === 201) {
        setShowAlert(true);
        if (messageTextareaRef.current) {
          messageTextareaRef.current.value = "";
        }
        setTimeout(() => {
          setShowAlert(false);
        }, 5000);
        console.log("Form submitted successfully!");
            
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
    }
  }
  return (
    <div className=''>
      <ShortCuts />
      {/* <div className='mt-5 mx-3 grid grid-cols-2 gap-4'> */}
      <div className='mt-5 mx-3 '>
      <form onSubmit={handleSubmit} className='  bg-slate-600 py-5 px-2 rounded-sm'>
        <div className=' flex justify-evenly'>
          <div>
            <label className='me-3 font-semibold font-serif text-sm'>Select Party to Send Sms:</label>
            <select name="party"
            required
                id="cars"
                className="text-black outline-none rounded-sm"
                onChange={(e) => setSelectedGroup(e.target.value)}>
                  
              <option value=""></option>
              <option value="all">All Groups</option>
              <option value="wholesale">Whole Sale Customers</option>
              <option value="retail">Retail Customers</option>
              <option value="debtors">Debtors</option>
              <option value="employees">Employees</option>
            </select>
          </div>
          <div>
            <label className='me-3 font-semibold font-serif text-sm'>Select Customers Location:</label>
            <select name="locations"
            required
                id="locations"
                className="text-black outline-none rounded-sm"
                onChange={(e) => {
                  if (e.target.value === ''){
                    setSelectedLocation('all');
                  } else {
                    setSelectedLocation(e.target.value);
                  }
                }}>
                <option ></option>
                <option value=''>All Locations</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
          </div>
        </div>
        <div className=' text-center mt-5'>
          <textarea  ref={messageTextareaRef} className='h-28 text-black p-2 w-full outline-none rounded-sm'></textarea>
        </div>
        <div className='flex justify-end mt-2'>
            <button className=" bg-blue-500 py-1 px-2 flex items-center rounded-md">
                {isSubmitting ?
                ( <Box sx={{ display: 'flex' }}>
                <CircularProgress className=" !text-white" />
              </Box>): (<>Send <SendIcon /></>)
                }
              </button>
        </div>
      </form>
      {/* <div>
        <RightContent />
      </div> */}
      </div>
      
    </div>
  )
}

export default SendSms