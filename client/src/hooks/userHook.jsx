import { createContext, useContext, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { roles, config } from "../config/roles";

const context = createContext();

export const UserContextProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [userConfig, setUserConfig] = useState(null);

  useEffect(() => {
    let user = {
      nombre: "Octavio Pizarro",
      role: "Doctor",
      correo: "pepe@gmail.com",
      clave: "pepe",
      genero: "masculino",
      nacimiento: "2001-09-11",
      fecha_alta: "2024-01-01 00:00:00",
      direccion: "Av. Aramburu 2300",
      descripcion:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero eius corporis accusamus aliquid a. Ut excepturi facere corrupti necessitatibus enim esse deleniti rem ducimus, alias vel, sit accusantium repellendus eveniet?",
      especialidad: "Cardiología",
    };
    if (user != null) {
      setUserInfo({
        ...user,
        role: user.role,
      });
      let key = Object.keys(roles).find((k) => roles[k] === user.role);
      setUserConfig({
        theme: config.theme[key],
        nav: config.nav[key],
      });
    }
  }, []);

  console.log(userInfo, userConfig);
  return (
    <context.Provider value={{ userInfo, userConfig }}>
      {
        <div>
          <div
            className={
              "fixed top-0 left-0 w-full min-h-dvh bg-gray-300 z-50 transition-all duration-1000 " +
              (userInfo && userConfig && "opacity-0 invisible")
            }
          >
            <div className="fixed w-full h-full flex items-center justify-center">
              <img src="img/logo.png" className="animate-fadeIn" />
            </div>
          </div>
          {userInfo && userConfig && <Outlet />}
        </div>
      }
    </context.Provider>
  );
};

export const userHook = () => useContext(context);
