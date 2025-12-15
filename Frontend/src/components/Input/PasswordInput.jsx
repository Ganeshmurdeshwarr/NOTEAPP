import React, { useState } from 'react'
import { FaRegEye ,FaRegEyeSlash} from "react-icons/fa";

const PasswordInput = ({value , onChange , placeholder}) => {

    const [showPassword , setShowPassword] = useState(false);
     const toggleShowPassword = () =>{
    setShowPassword(!showPassword); 
    
    }
  return (
    <div className='flex items-center bg-trasparent border-[1.5px] px-5 rounded mb-3 '>
        <input 
        value={value}
        onChange={onChange}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder || "Password"}
        className='w-full text-sm bg-trasparent py-3 mr-3 rounded outline-none'
        />
       {showPassword ? (<FaRegEye 
        size={20}
        className="text-primary cursor-pointer "
        onClick={()=> toggleShowPassword()}
        /> ): (<FaRegEyeSlash 
        size={20}
        className="text-primary cursor-pointer"
        onClick={()=> toggleShowPassword()}
        />)}
      
    </div>
  )
}

export default PasswordInput