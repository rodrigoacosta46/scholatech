import { createContext, useContext } from "react";

const context = createContext();

export const UserContextProvider = ({children}) => {
    const config = {
        nav: {
            pacient: {
                "Información general": "/profile",
                "Notificaciones": "/reminders",
                "Doctores": "/doctors",
                "Historial": "/story",
                "Calendario": "/schedule",
                "Información de medicamentos": "/drugs",
            },
            doctor: {
                "Información general": "/profile",
            }
        }
    }
    let user = {name:"Octavio Pizarro", role:"pacient"};
    const userInfo = user;
    const userNav = config.nav[user.role];
    
    return(
        <context.Provider value={{ userInfo, userNav}}>
            {children}
        </context.Provider>
    )
}

export const userHook = () => useContext(context);