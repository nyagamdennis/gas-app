import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { login, selectAuthError, selectAuthLoading, selectIsAuthenticated } from '../features/auths/authSlice';
import { ClipLoader } from 'react-spinners';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';


const ForgotPassword = () => {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const error = useAppSelector(selectAuthError);
    const isLoading = useAppSelector(selectAuthLoading);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const handleUsernameInput = (e: any) => setEmail(e.target.value);
    const handlePwdInput = (e: any) => setPassword(e.target.value);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();




    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // @ts-ignore
        dispatch(login({ email, password }));
      };

      useEffect(() => {
        if (isAuthenticated) {
          navigate('/');
        }
      }, [isAuthenticated, navigate]);
    
    
      useEffect(() => {
        if (error) {
          setErrMsg(error);
        }
      }, [error]);
    

      const canSubmit = [email].every(Boolean);
  return (
    <div>
         <section className='h-screen bg-gradient-to-br from-pale-green to-whitish flex items-center justify-center'>
      
      <div className=" bg-gray p-8 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='text-center flex justify-center'>
            <ErrorOutlineIcon className='  !text-link-color !text-5xl' />
            </div>
       
          <p className='text-2xl font-bold text-center mb-6'>Forgot password?</p>
          
          <div>{errMsg && (
        <div className=''>
          <Alert severity="error">{errMsg}</Alert>
          {/* <p>Error! {errMsg}</p> */}
        </div>
      )}</div>
          <p className=' text-xs font-semibold'>Enter your email and we will send you a link to reset your account password</p>
          <div>
            <label className='block mb-2'>Email*</label>
            <div className="input-group mb-3 flex items-center bg-white rounded">
              <span className="input-group-text p-2 bg-gray-100 rounded-l">
                <PersonIcon className='' />
              </span>
              <input
                type='text'
                placeholder='john@gmail.com'
                name='email'
                className='form-control p-2 flex-grow rounded-r outline-none'
                onChange={handleUsernameInput}
                required
              />
            </div>
          </div>
          <div>
            <button
              className='w-full bg-gradient-to-r from-green to-yellow  font-bold cursor-pointer text-white py-2 px-4 rounded hover:bg-blue-600 '
              disabled={!canSubmit || isLoading}
            >
              {isLoading ? <ClipLoader size={15} color={"#ffffff"} /> : 'Submit'}
            </button>
          </div>

          <div className='text-center mt-4 flex items-center'>
            <ChevronLeftIcon />
            <p>
              Back to login{' '}
              <Link className=' text-link-color font-bold' to='/login'>
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
    </div>
  )
}

export default ForgotPassword