import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { UserContextProvider } from '../hooks/userHook';

const AuthUserLayout = ({ children }) => {

  return (
    <UserContextProvider>
      <div className="min-w-fit min-h-dvh flex bg-gray-300 overflow-hidden">
        <Sidebar />
        <div className="flex flex-col relative grow h-dvh overflow-y-auto">
          <Outlet/>
        </div>
      </div>
    </UserContextProvider>
  );
};

export default AuthUserLayout;
