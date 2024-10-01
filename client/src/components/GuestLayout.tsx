import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import { parseAuthenticatedHelper } from '../hooks/orderprocessor';
import { AuthMethodHandler } from '../hooks/AuthValidator';
import React from 'react';


const GuestLayout = ({ children }) => {
  useEffect(() => {
    const authHandler = new AuthMethodHandler(true);
  }, []);

  return (
    <div className="min-w-fit min-h-dvh bg-[#dae3de]">
      <div className="w-full h-fit flex flex-col items-center ">
        <img src="img/logo.png" alt="Page LOGO" className="w-32 p-2" />
        <Outlet/>
      </div>
    </div>
  );
};

export default GuestLayout;
