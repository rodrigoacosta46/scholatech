import { Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { userHook } from '../hooks/userHook';

const Sidebar = () => {
  const { userInfo, userConfig } = userHook();
  const location = useLocation();
  const [modal, setModal] = useState(false);
  const [sideView, toggleSideView] = useState(false);


  useEffect(() => {
    window.addEventListener('keyup', (e) => {
      e.key == "Escape" && toggleSideView(prev => 
        prev && !prev
      );
    });
    return () => {
      window.removeEventListener('keyup', undefined);
    }
  }, [])

  const logout = () => {
    window.location.href = process.env.REACT_APP_API_URL
  + '/logout';
  };

  return (
    <>
      <Modal
        state={modal}
        setter={() => setModal(prev => !prev)}
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
      
      <button onClick={() => toggleSideView(prev => !prev)} className='md:hidden z-50 fixed top-5 end-10'>
        <i className="fa-solid fa-bars text-lg text-white"></i>
      </button>

      <div 
        role='presentation'
        className={`z-50 transition-[width] duration-500 fixed top-0 start-0 h-full bg-slate-500 opacity-30 ${sideView ? 'w-svw' : 'w-0'}`} 
        onClick={() => toggleSideView(prev => !prev)}
      />

      <aside
        className={`z-50 transition-transform duration-500 fixed md:static start-0 top-0 w-64 min-h-full flex flex-col bg-${userConfig.theme}-950 text-lg md:translate-x-0 ${sideView ? 'translate-x-0' : '-translate-x-full'} `}
      >
        <button
          onClick={() => setModal(prev => !prev)}
          className="cursor-pointer w-fit after:content-['Log_Out'] after:underline after:absolute after:translate-x-0 lg:after:-translate-x-full after:opacity-0 hover:after:translate-x-0 hover:after:opacity-100 after:transition-all text-gray-400 hover:text-red-400"
        >
          <i className="fa-solid fa-arrow-right-from-bracket rotate-180 "></i>
        </button>
        <div className="h-full flex flex-col justify-between gap-4">
          <div
            className={
              `grid grid-flow-col grid-cols-2 gap-1 m-2 transition-all duration-1000 ${
                location.pathname === '/profile' ? 'translate-x-full opacity-0 pointer-events-none' : ''
              }`}
          >
            <img src={process.env.REACT_APP_API_URL
  + `/getImage/profiles/${userInfo.ID}/${userInfo.ID}`} alt="" className="size-36 object-cover rounded-full" />
            <div>
              <p className="text-xl text-white line-clamp-3">{userInfo["Username"]}</p>
              <p className="text-md text-gray-500">{userInfo["Perfil"].Name}</p>
            </div>
          </div>
          <div className="scroll w-72 max-h-80 overflow-y-auto grow">
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
      </aside>
    </>
  );
};

export default Sidebar;
