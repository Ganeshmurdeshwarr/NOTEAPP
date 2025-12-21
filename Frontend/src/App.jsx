import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./page/Home/Home";
import Login from "./page/Login/Login";
import SingUp from "./page/SingUp/SingUp";



const App = () => {
  return (
   <Routes>
    <Route path="/dashboard" element={<Home/>} />
    <Route path="/login" element={<Login/>} />
    <Route path="/signup" element={<SingUp/>} />
   </Routes>
  );
};

export default App;
