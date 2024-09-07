import Sidebar from './Sidebar';

const AuthUserLayout = ({ children }) => {
  return (
    <div className="min-w-fit min-h-dvh flex bg-white">
      <Sidebar />
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};

export default AuthUserLayout;
