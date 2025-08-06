import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { UserContextProvider } from '../hooks/userHook';
import React, { useEffect } from 'react';
import { AuthMethodHandler } from '../hooks/AuthValidator';



const AuthUserLayout = ({}) => {
  useEffect(() => {
    const authHandler = new AuthMethodHandler(false);
  }, []);
  
  return (
      <div className="min-w-svw h-svh flex bg-gray-300 overflow-hidden">
        <Sidebar />
        <main className="flex flex-col relative grow h-full overflow-y-auto">
          <Outlet/>
        </main>
      </div>
  );
};

export default AuthUserLayout;
