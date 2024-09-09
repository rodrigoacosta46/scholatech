import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Sidebar = () => {
  const location = useLocation();
  const [xd, setXd] = useState(""); 

  useEffect(() => {
    setXd(location.pathname === "/profile" ? "translate-x-full opacity-0" : "");
  }, [location.pathname]); 

  return (
    <div className="flex flex-col w-64 min-h-dvh bg-green-950 gap-7">
      <span className="cursor-pointer w-fit after:content-['Log_Out'] after:underline after:absolute after:translate-x-0 lg:after:-translate-x-full after:opacity-0 hover:after:translate-x-0 hover:after:opacity-100 after:transition-all text-gray-400 hover:text-red-400">
        <i className="fa-solid fa-arrow-right-from-bracket rotate-180 "></i>
      </span>
        <div className={"w-full relative top-8 bottom-8 flex justify-self-start gap-2 p-2 transition-all " + xd}>
          <img
            src="img/Gaben.png"
            alt="Page LOGO"
            className="w-20 rounded-full"
          />
          <div className="flex flex-col">
            <p className="text-xl text-white text-wrap max-h-28 overflow-hidden me-2">
              Hernandez Gutierrez Nunez
            </p>
            <p className="text-sm text-gray-500">Paciente</p>
          </div>
        </div>
        <div
          className="scroll flex flex-col w-72 h-72 md:h-96 overflow-y-auto overflow-x-hidden z-50"
          style={{ direction: 'rtl' }}
        >
          <Link to="/profile"
            className="group min-h-fit w-64 hover:w-full flex items-center self-end gap-[3px] text-slate-400 hover:text-white hover:bg-green-700 py-4 transition-all cursor-pointer"
            style={{ direction: 'ltr' }}
          >
            <div className="w-full text-center text-wrap transition-all px-2 relative">
              <i className="fa-sharp-duotone fa-solid fa-heart-circle-exclamation fa-light pe-2"></i>
              Informacion general
              <div className="absolute transition-all duration-500 bg-white h-px w-72 end-full group-hover:end-4"></div>
            </div>
          </Link>
          <Link to="/reminders"
            className="group min-h-fit w-64 hover:w-full flex items-center self-end gap-[3px] text-slate-400 hover:text-white hover:bg-green-700 py-4 transition-all cursor-pointer"
            style={{ direction: 'ltr' }}
          >
            <div className="w-full text-center text-wrap transition-all px-2 relative">
            <i class="fa-solid fa-envelope pe-2"></i>
              Notificaciones
              <div className="absolute transition-all duration-500 bg-white h-px w-72 end-full group-hover:end-4"></div>
            </div>
          </Link>
          <Link to="/doctors"
            className="group min-h-fit w-64 hover:w-full flex items-center self-end gap-[3px] text-slate-400 hover:text-white hover:bg-green-700 py-4 transition-all cursor-pointer"
            style={{ direction: 'ltr' }}
          >
            <div className="w-full text-center text-wrap transition-all px-2 relative">
              <i className="fa-sharp-duotone fa-solid fa-heart-circle-exclamation fa-light pe-2"></i>
              Doctores
              <div className="absolute transition-all duration-500 bg-white h-px w-72 end-full group-hover:end-4"></div>
            </div>
          </Link>
          <Link to="/story"
            className="group min-h-fit w-64 hover:w-full flex items-center self-end gap-[3px] text-slate-400 hover:text-white hover:bg-green-700 py-4 transition-all cursor-pointer"
            style={{ direction: 'ltr' }}
          >
            <div className="w-full text-center text-wrap transition-all px-2 relative">
              <i className="fa-sharp-duotone fa-solid fa-heart-circle-exclamation fa-light pe-2"></i>
              Historial
              <div className="absolute transition-all duration-500 bg-white h-px w-72 end-full group-hover:end-4"></div>
            </div>
          </Link>
          <Link to="/schedule"
            className="group min-h-fit w-64 hover:w-full flex items-center self-end gap-[3px] text-slate-400 hover:text-white hover:bg-green-700 py-4 transition-all cursor-pointer"
            style={{ direction: 'ltr' }}
          >
            <div className="w-full text-center text-wrap transition-all px-2 relative">
              <i className="fa-sharp-duotone fa-solid fa-heart-circle-exclamation fa-light pe-2"></i>
              Calendario
              <div className="absolute transition-all duration-500 bg-white h-px w-72 end-full group-hover:end-4"></div>
            </div>
          </Link>
          <Link to="/drugs"
            className="group min-h-fit w-64 hover:w-full flex items-center self-end gap-[3px] text-slate-400 hover:text-white hover:bg-green-700 py-4 transition-all cursor-pointer"
            style={{ direction: 'ltr' }}
          >
            <div className="w-full text-center text-wrap transition-all px-2 relative">
              <i class="fa-solid fa-prescription-bottle-medical pe-2"></i>
              Información sobre medicamentos
              <div className="absolute transition-all duration-500 bg-white h-px w-72 end-full group-hover:end-4"></div>
            </div>
          </Link>
        </div>
        <img
        src="img/logo.png"
        alt="Page LOGO"
        className="w-36 md:w-48 mx-auto block"
      />
      </div>
      
  );
};

export default Sidebar;
