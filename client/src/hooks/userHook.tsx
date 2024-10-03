import { createContext, useContext, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { roles, config } from "../config/roles";
import React from 'react';

interface userConfig {
  theme: string,
  nav: string,
}

interface UserContextType {
  userInfo: object;
  userConfig: userConfig;
}  

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserContextProvider = ({}) => {
  const [userInfo, setUserInfo] = useState<object>({});
  const [userConfig, setUserConfig] = useState<userConfig>({
    theme: "a",
    nav: "a'"
  });

  useEffect(() => {
    var model;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:8000/sync', false); // Cambia 'false' a 'true' si deseas que sea asíncrono
  
    xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
      console.log('Respuesta:', xhr.responseText);
      model = JSON.parse((JSON.parse(xhr.responseText)).message);
    } else {
      console.error('Error en la solicitud:', xhr.statusText);
    }
    };
    xhr.withCredentials = true;
    xhr.send();
    console.log(model);

    var user = {name: '', role: 'Admin'}
    user = model;
    console.log(user);
    if (user != undefined) {
      console.log('asdasd');
      setUserInfo({
        ...user,
        role: user.role,
      });
      let key = Object.keys(roles).find((k) => roles[k] === 'Admin');
      setUserConfig({
        theme: config.theme[key],
        nav: config.nav[key],
      });
    }
  }, []);

  console.log(userInfo, userConfig);
  return (
    <UserContext.Provider value={{ userInfo, userConfig }}>
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
    </UserContext.Provider>
  );
};

//export const userHook = () => useContext(context);
//export const userHook = () => useContext(context);
export const userHook = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("userHook doesnt have a context");
  }
  return context;
};