import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AuthUserLayout = ({ children }) => {

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
