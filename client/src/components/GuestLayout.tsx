import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthMethodHandler } from '../hooks/AuthValidator';

const GuestLayout = ({}) => {
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
