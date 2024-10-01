import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { UserContextProvider } from '../hooks/userHook';
import React, { useEffect } from 'react';
import { AuthMethodHandler } from '../hooks/AuthValidator';



const AuthUserLayout = ({ children }) => {
  useEffect(() => {
    const authHandler = new AuthMethodHandler(false);
  }, []);
  
  /*
=======
import { userHook } from '../hooks/userHook';

const AuthUserLayout = ({ children }) => {
  const { userInfo } = userHook();
  const navigate = useNavigate();

  if (!userInfo) {
    console.log("Usuario no autenticado");
    navigate("/login");  
  }
*/
  return (
      <div className="min-w-fit min-h-dvh flex bg-gray-300 overflow-hidden">
        <Sidebar />
        <div className="flex flex-col relative grow h-dvh overflow-y-auto">
          <Outlet/>
        </div>
      </div>
  );
};

export default AuthUserLayout;
