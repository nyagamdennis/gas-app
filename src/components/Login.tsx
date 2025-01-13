import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { login, selectAuthError, selectAuthLoading, selectIsAuthenticated } from '../features/auths/authSlice';
import { ClipLoader } from 'react-spinners';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';
import { useAppSelector } from '../app/hooks';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const [passVisibility, setPasswordVisibility] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const error = useAppSelector(selectAuthError);
  const isLoading = useAppSelector(selectAuthLoading);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const handleUsernameInput = (e: any) => setEmail(e.target.value);
  const handlePwdInput = (e: any) => setPassword(e.target.value);

  const canSubmit = [email, password].every(Boolean);

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



  const handlePasswordVisisbility = () => {
    setPasswordVisibility(!passVisibility)
  }
  return (
    <section className='h-screen bg-gradient-to-br from-pale-green to-whitish flex items-center justify-center'>
      
      <div className=" bg-gray-400 p-8 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={handleSubmit} className='space-y-4'>
          <p className='text-2xl font-bold text-center mb-6'>Login</p>
          <div>{errMsg && (
        <div className=''>
          <Alert severity="error">{errMsg}</Alert>
          {/* <p>Error! {errMsg}</p> */}
        </div>
      )}</div>
          
          <div>
            <label className='block mb-2'>Email/Phone Number *</label>
            <div className="input-group mb-3 flex items-center bg-white rounded">
              <span className="input-group-text p-2 bg-gray-100 rounded-l">
                <PersonIcon className='' />
              </span>
              <input
                type='text'
                placeholder='john@gmail.com or +2540000000'
                name='email'
                className='form-control p-2 flex-grow rounded-r outline-none'
                onChange={handleUsernameInput}
                required
              />
            </div>
          </div>

          <div>
            <label className='block mb-2'>Password *</label>
            <div className="input-group mb-3 flex items-center bg-white rounded">
              <span className="input-group-text p-2 bg-gray-100 rounded-l">
                <LockIcon />
              </span>
              <input
                 type={passVisibility ? 'text' : 'password'}
                placeholder='password'
                name='password'
                className='form-control p-2 flex-grow rounded-r outline-none border-none'
                onChange={handlePwdInput}
                required
              />
              <span onClick={handlePasswordVisisbility} className=" !bg-white">
                    {passVisibility ? <VisibilityIcon className=" !bg-white cursor-pointer pe-1" /> : <VisibilityOffIcon  className=" !bg-white cursor-pointer pe-1" /> }
                  </span>
            </div>
            
          </div>

          <div className='flex justify-end mb-4'>
            <Link className=' underline text-sm' to='/forgot-password'>
              Forgot Password?
            </Link>
          </div>

          <div>
            <button
              className='w-full bg-gradient-to-r from-green-500 to-yellow-400  font-bold cursor-pointer text-white py-2 px-4 rounded hover:bg-blue-600 '
              disabled={!canSubmit || isLoading}
            >
              {isLoading ? <ClipLoader size={15} color={"#ffffff"} /> : 'LOGIN'}
            </button>
          </div>

          <div className='text-center mt-4'>
            <p>
              Don't have an account?{' '}
              <Link className=' text-link-color font-bold' to='/register'>
                SignUp
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}


export default Login;