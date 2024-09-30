import { createContext, useContext } from 'react';

const context = createContext();
const roles = {
  pacient: 'Paciente',
  doctor: 'Doctor',
  admin: 'Admin',
};
const config = {
  theme: {
    admin: 'red',
    doctor: 'blue',
    pacient: 'green',
  },
  nav: {
    admin: {
      'Información general': {
        route: '/profile',
        icon: 'fa-sharp-duotone fa-solid fa-heart-circle-exclamation fa-light pe-2',
      },
      Notificaciones: {
        route: '/reminders',
        icon: 'fa-solid fa-envelope pe-2',
      },
      'Listado de usuarios': {
        route: '/list',
        icon: 'fa-solid fa-users pe-2',
      },
      'Información de medicamentos': {
        route: '/drugs',
        icon: 'fa-solid fa-prescription-bottle-medical pe-2',
      },
    },
    doctor: {
      'Información general': {
        route: '/profile',
        icon: 'fa-sharp-duotone fa-solid fa-heart-circle-exclamation fa-light pe-2',
      },
      Notificaciones: {
        route: '/reminders',
        icon: 'fa-solid fa-envelope pe-2',
      },
      'Información de medicamentos': {
        route: '/drugs',
        icon: 'fa-solid fa-prescription-bottle-medical pe-2',
      },
    },
    pacient: {
      'Información general': {
        route: '/profile',
        icon: 'fa-sharp-duotone fa-solid fa-heart-circle-exclamation fa-light pe-2',
      },
      Notificaciones: {
        route: '/reminders',
        icon: 'fa-solid fa-envelope pe-2',
      },
      Doctores: {
        route: '/doctors',
        icon: 'fa-solid fa-user-doctor pe-2',
      },
      Historial: {
        route: '/story',
        icon: 'fa-solid fa-box-archive pe-2',
      },
      Calendario: {
        route: '/schedule',
        icon: 'fa-regular fa-calendar-days pe-2',
      },
      'Información de medicamentos': {
        route: '/drugs',
        icon: 'fa-solid fa-prescription-bottle-medical pe-2',
      },
    },
  },
};
export const UserContextProvider = ({ children }) => {
  let user = { name: 'Octavio Pizarro', role: 'admin' };
  const userInfo = {
    ...user,
    role: roles[user.role],
  };
  const userConfig = {
    theme: config.theme[user.role],
    nav: config.nav[user.role],
  };
  console.log(userInfo);
  return (
    <context.Provider value={{ userInfo, userConfig }}>
      {children}
    </context.Provider>
  );
};

export const userHook = () => useContext(context);
