import React, { useState } from 'react'

import { Link } from 'react-router-dom'
import PasswordInput from '../../components/Input/PasswordInput'
import { validateEmail } from '../../utils/helper'
import Navbar from '../../components/Navbar/Navbar'

const Login = () => {

  const [email ,setEmail] = useState("");
  const [password , setPassword] = useState("");
  const [error , setError]= useState(null);

  const handleLogin = (e) =>{
    e.preventDefault() ;

    if(!validateEmail(email)){
      setError("Invalid email format");

      return;
    }
    setError (null);
  }


  return (
    <> 
    <Navbar/>

<div className='flex item-center justify-center mt-28 '>
  <div className='w-96 border rounded bg-white px-7 py-10 '>
    <form onSubmit={handleLogin}>
      <h4 className='text-2xl mb-7'>Login</h4>

      <input type="text" placeholder='Email' className='input-box'
       value={email} 
       onChange={(e)=> setEmail(e.target.value)}/>

      <PasswordInput
      value={password} 
      onChange={(e)=> setPassword(e.target.value)}
      />

      {  error && (<p className='text-sm text-red-500 mb-3'>{error}</p>
      )}


      <button type='submit' className='btn-primary'>Login</button>

      <p className='text-sm text-center mt-4'>Not registerd yet?
        <Link to='/singup' className='font-medium text-primary underline ml-2'>
        Create an Account</Link>
      </p>
    </form>
  </div>
</div>

    </>
  )
}

export default Login