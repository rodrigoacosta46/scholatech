const GuestLayout = ({ children }) => {
  return (
    <div className="min-w-fit min-h-dvh bg-[#dae3de]">
      <div className="w-full h-fit flex flex-col items-center ">
        <img src="img/logo.png" alt="Page LOGO" className="w-56" />
        {children}
      </div>
    </div>
  );
};

export default GuestLayout;
