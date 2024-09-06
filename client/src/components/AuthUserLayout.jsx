import Sidebar from './Sidebar';

const AuthUserLayout = ({ children }) => {
  return (
    <div className="min-w-fit min-h-dvh bg-white">
      <Sidebar />
      {children}
    </div>
  );
};

export default AuthUserLayout;
