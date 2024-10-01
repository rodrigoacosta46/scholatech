import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { userHook } from '../hooks/userHook';

const AuthUserLayout = ({ children }) => {
  const { userInfo } = userHook();
  const navigate = useNavigate();

  if (!userInfo) {
    console.log("Usuario no autenticado");
    navigate("/login");  
  }

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
