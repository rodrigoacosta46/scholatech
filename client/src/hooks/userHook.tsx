import { createContext, useContext, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { roles, config } from "../config/roles";
import React from 'react';

interface userConfig {
  theme: string,
  nav: string,
}

interface UserContextType {
  userInfo: UserInterface;
  userConfig: userConfig;
}  

export interface ProfileInterface {
  ID: number,
  Name: string,
  Description: string,
  CreatedAt: string,
  UpdatedAt: string,
  DeletedAt: string
}

/*
export interface RoleInterface {
  ID: number,
  UsuarioID: number,
  PerfilID: number,
  Perfil: ProfileInterface,
  CreatedAt:  string,
  UpdatedAt: string,
  DeletedAt:  string,
}
*/
export interface UserInterface {
    ID: number,
    Username: string,
    Email: string,
    Password: string,
    Picture: string,
    Telephone: string,
    Description: string,
    Address: string,
    Speciality: string,
    Gender: string,
    Birthdate: string,
    CreatedAt:  string,
    UpdatedAt: string,
    DeletedAt:  string,
    Perfil: ProfileInterface
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserContextProvider = ({}) => {
  const [loading, setLoading] = useState(true); // Estado de carga

  const [userInfo, setUserInfo] = useState<UserInterface>({
    ID: 0,
    Username: "Cargando...",
    Email: "Cargando...",
    Password: "",
    Picture: "img/logo.png",
    Telephone: "Cargando...",
    Address: "Cargando...",
    Description: "Cargando...",
    Speciality: "Cargando...",
    Gender: "Cargando...",
    Birthdate: "Cargando...",
    CreatedAt:  "Cargando...",
    UpdatedAt: "Cargando...",
    DeletedAt:  "Cargando...",
    Perfil: {
      ID: 0,
      Name: "Cargando perfil...",
      Description: "Cargando perfil...",
      CreatedAt: "Cargando perfil...",
      UpdatedAt: "Cargando perfil...",
      DeletedAt: "Cargando perfil..."
    },
  });

  const [userConfig, setUserConfig] = useState<userConfig>({
    theme: "a",
    nav: "a'"
  });

  useEffect(() => {
    let model: UserInterface | undefined = undefined;
    const xhr = new XMLHttpRequest();
  
    xhr.open('GET', 'http://localhost:8000/sync', false);
    
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        console.log('Respuesta:', xhr.responseText);
  
        try {
          const response = JSON.parse(xhr.responseText);
          model = JSON.parse(response.message);
        } catch (error) {
          console.error('Error al parsear la respuesta:', error);
        }
      } else {
        console.error('Error en la solicitud:', xhr.statusText);
      }
  
      if (model !== undefined) {
        setUserInfo({
          ...model,
          Password: "*****",
          Birthdate: `${model.Birthdate.split("T")[0]}`,
        });
  
        let key = Object.keys(roles).find((k) => roles[k] === model?.Perfil.Name);
        setUserConfig({
          theme: config.theme[key],
          nav: config.nav[key],
        });
      }
      setLoading(false);
    };
  
    xhr.withCredentials = true;
    xhr.send();
  }, []);


  console.log(userInfo, userConfig);
  return (
    <UserContext.Provider value={{ userInfo, userConfig }}>
      {
        <div>
          <div
            className={
              "fixed top-0 left-0 w-full min-h-dvh bg-gray-300 z-50 transition-all duration-1000 " +
              (!loading && "opacity-0 invisible")
            }
          >
            <div className="fixed w-full h-full flex items-center justify-center">
              <img src="img/logo.png" className="animate-fadeIn" />
            </div>
          </div>
          {!loading && <Outlet />}
        </div>
      }
    </UserContext.Provider>
  );
};

export const userHook = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("userHook doesnt have a context");
  }
  return context;
};