import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const location = useLocation();
  const [userView, setUserView] = useState(false);
  
  useEffect(() => {
    setUserView(location.pathname === "/profile" ? "translate-x-full opacity-0" : "");
  }, [location.pathname]);

  return (
    <div className="w-64 min-h-full flex flex-col bg-green-950 ">
      <span className="cursor-pointer w-fit after:content-['Log_Out'] after:underline after:absolute after:translate-x-0 lg:after:-translate-x-full after:opacity-0 hover:after:translate-x-0 hover:after:opacity-100 after:transition-all text-gray-400 hover:text-red-400">
        <i className="fa-solid fa-arrow-right-from-bracket rotate-180 "></i>
      </span>
      <div className="h-full flex flex-col justify-between gap-4">
        <div 
          className={"grid grid-flow-col grid-cols-2 gap-1 m-2 transition-all duration-500 " + userView}
        >
          <img src="img/Gaben.png" alt="" className="rounded-full" />
          <div>
            <p className="text-xl text-white line-clamp-3">
              Hernandez Gutierrez Sousa
            </p>
            <p className="text-md text-gray-500">Paciente</p>
          </div>
        </div>
        <div className="scroll w-72 overflow-y-auto h-0 grow z-50">
          <div
            className="h-full flex flex-col items-start justify-center"
            style={{ direction: "ltr" }}
          >
            <Link
              to="/profile"
              className="group w-64 p-3 transition-all hover:w-full hover:bg-green-700 text-white text-lg text-thin text-end"
            >
              <i className="fa-sharp-duotone fa-solid fa-heart-circle-exclamation fa-light pe-2"></i>
              Información general
              <div className="bg-white h-px w-0 transition-all duration-500 group-hover:w-full"></div>
            </Link>
            <Link
              to="/reminders"
              className="group w-64 p-3 transition-all hover:w-full hover:bg-green-700 text-white text-lg text-thin text-end"
            >
              <i className="fa-solid fa-envelope pe-2"></i>
              Notificaciones
              <div className="bg-white h-px w-0 transition-all duration-500 group-hover:w-full"></div>
            </Link>
            <Link
              to="/doctors"
              className="group w-64 p-3 transition-all hover:w-full hover:bg-green-700 text-white text-lg text-thin text-end"
            >
              <i className="fa-solid fa-user-doctor pe-2"></i>
              Doctores
              <div className="bg-white h-px w-0 transition-all duration-500 group-hover:w-full"></div>
            </Link>
            <Link
              to="/story"
              className="group w-64 p-3 transition-all hover:w-full hover:bg-green-700 text-white text-lg text-thin text-end"
            >
              <i className="fa-solid fa-box-archive pe-2"></i>
              Historial
              <div className="bg-white h-px w-0 transition-all duration-500 group-hover:w-full"></div>
            </Link>
            <Link
              to="/schedule"
              className="group w-64 p-3 transition-all hover:w-full hover:bg-green-700 text-white text-lg text-thin text-end"
            >
              <i className="fa-regular fa-calendar-days pe-2"></i>
              Calendario
              <div className="bg-white h-px w-0 transition-all duration-500 group-hover:w-full"></div>
            </Link>
            <Link
              to="/drugs"
              className="group w-64 p-3 transition-all hover:w-full hover:bg-green-700 text-white text-lg text-thin text-end"
            >
              <i className="fa-solid fa-prescription-bottle-medical pe-2"></i>
              Información de medicamentos
              <div className="bg-white h-px w-0 transition-all duration-500 group-hover:w-full"></div>
            </Link>
          </div>
        </div>
        <img src="img/logo.png" alt="Page LOGO" className="w-24 mx-auto mb-1" />
      </div>
    </div>
  );
};

export default Sidebar;
