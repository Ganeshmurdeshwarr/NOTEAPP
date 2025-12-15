import React from "react";

import PasswordInput from "../../components/Input/PasswordInput";
import { Link } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import Navbar from "../../components/Navbar/Navbar";

const SingUp = () => {

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);


  const handleSingUp = async (e) => {
    e.preventDefault();
    if(!name){
      setError("Name is required");
      return;
    }
    if(!validateEmail(email)){
      setError("Invalid email format");
      return;
    }
    if(!password){
      setError("Password is required");
      return
    }
    setError('')
  };
  return (
    <>
      <Navbar/>
      <div className="flex item-center justify-center mt-28 ">
        <div className="w-96 border rounded bg-white px-7 py-10 ">
          <form onSubmit={handleSingUp}>
            <h4 className="text-2xl font-semibold mb-7">SignUp</h4>

            <input
              type="text"
              placeholder="Name"
              className="input-box"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {  error && (<p className='text-sm text-red-500 mb-3'>{error}</p>
      )}


      <button type='submit' className='btn-primary'>Create Account</button>

      <p className='text-sm text-center mt-4'>Already have an account?
        <Link to='/login' className='font-medium text-primary underline ml-2'>
        Login</Link>
      </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SingUp;
