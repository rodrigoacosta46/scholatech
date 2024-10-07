import { Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { userHook } from '../hooks/userHook';

const Sidebar = () => {
  const { userInfo, userConfig } = userHook();
  const location = useLocation();
  const [userView, setUserView] = useState("");
  const [modal, setModal] = useState(false);

  const setModalState = () => {
    setModal(!modal);
  }


  useEffect(() => {
    setUserView(
      String((window.location.pathname === '/profile') ? 'translate-x-full opacity-0' : '')
    );
  }, [location.pathname]);
 
  const logout = () => {
    window.location.href = 'http://localhost:8000/logout';
  };

  return (
    <>
      <Modal
        state={modal}
        setter={setModalState}
        allowAnimations={false}
        scheme={userConfig.theme}
      >
        <div className="col-span-2 text-center">
          <p className={`text-${userConfig.theme}-800 text-xl font-semibold`}>
            Estás seguro de salir de tu sesión?
          </p>
          <span className="text-lg text-bold text-red-600 w-full ">
            <i className="fa-solid fa-arrow-right-from-bracket rotate-180 "></i>
            <button onClick={logout} className="cursor-pointer">
              Salir
            </button>
          </span>
        </div>
      </Modal>

      <div
        className={`w-64 min-h-full flex flex-col bg-${userConfig.theme}-950 text-lg`}
      >
        <button
          onClick={setModalState}
          className="cursor-pointer w-fit after:content-['Log_Out'] after:underline after:absolute after:translate-x-0 lg:after:-translate-x-full after:opacity-0 hover:after:translate-x-0 hover:after:opacity-100 after:transition-all text-gray-400 hover:text-red-400"
        >
          <i className="fa-solid fa-arrow-right-from-bracket rotate-180 "></i>
        </button>
        <div className="h-full flex flex-col justify-between gap-4">
          <div
            className={
              'grid grid-flow-col grid-cols-2 gap-1 m-2 transition-all duration-1000 ' +
              userView
            }
          >
            <img src="img/Gaben.png" alt="" className="rounded-full" />
            <div>
              <p className="text-xl text-white line-clamp-3">{userInfo["Username"]}</p>
              <p className="text-md text-gray-500">{userInfo["Perfil"].Name}</p>
            </div>
          </div>
          <div className="scroll w-72 overflow-y-auto h-0 grow z-30">
            <div className="h-full flex flex-col" style={{ direction: 'ltr' }}>
              {Object.keys(userConfig.nav).map((key, i) => (
                <Link
                  key={i}
                  to={userConfig.nav[key].route}
                  className={`group w-64 p-3 transition-all hover:w-full hover:bg-${userConfig.theme}-700 text-white text-lg text-thin text-end`}
                >
                  <i className={userConfig.nav[key].icon}></i>
                  {key}
                  <div className="bg-white h-px w-0 transition-all duration-500 group-hover:w-full"></div>
                </Link>
              ))}
            </div>
          </div>
          <img
            src="img/logo.png"
            alt="Page LOGO"
            className="w-24 mx-auto mb-1"
          />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
