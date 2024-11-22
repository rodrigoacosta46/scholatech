import { useEffect, useState } from "react";
import OpenCard from "./OpenCard";
import React from "react";
import useFetch from "../hooks/useFetch";

interface NotificationsProps {
  id: string,
  title: string,
  message: string,
  state: string,
}

const Notifications = (props: NotificationsProps) => {
  const [visible, setVisible] = useState(true);
  const [read, setReadState] = useState(props.state);
  const { response:successDiscard, fetcher:discard, error:errorDiscard } = useFetch(process.env.REACT_APP_API_URL
  + "/updateNotification/delete", {ID: props.id});
  const { response:successRead, fetcher:markAsRead, error:errorRead } = useFetch(process.env.REACT_APP_API_URL
  + "/updateNotification/read", {ID: props.id});
  const states = {
    "pendiente": "leido",
    "leido": "pendiente"
  }

  //Axios
  const handleDelete = () => {
    if(read != "pendiente"){
      discard()
    }
  };

  useEffect(() => {
    if (errorDiscard != null && errorDiscard.response.data) {
      return alert(errorDiscard.response.data.message);
    } 
    
    if (successDiscard != null) {
      console.log(successDiscard, errorDiscard);
      setVisible(!visible);
    }
  }, [successDiscard, errorDiscard])

  //Axios
  const handleCardReadState = (e) => {
    if (read != "leido") markAsRead();
  }

  useEffect(() => {
    if (errorRead != null && errorRead.response.data) {
      return alert(errorRead.response.data.message);
    } 
    
    if (successRead != null) {
      console.log(successRead, errorRead);
      setReadState(states[read]);
    }
  }, [successRead, errorRead])
  
  return (
    <div
      className={`overflow-hidden rounded-3xl transition-all duration-1000
        ${
          !visible ? "flag max-h-0 p-px" : "max-h-96 p-2"
        }
        ${
          read == "pendiente" && "animate-pulse text-yellow-400"
        }
        `
     }
     onClick={handleCardReadState}
    >
      <OpenCard
        className={`transition-[transform,opacity] duration-1000 ${
          !visible ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
        }`}
        icon={<i className="fa-solid fa-circle-info text-xl"></i>}
        title={props.title}
        content={<span className="text-gray-400">
            {props.message || (
              <p className="text-lg text-center text-gray-400">
                No hay nada que mostrar
              </p>
            )}</span>
        }
      >
        <div
          onClick={handleDelete}
          className="transition-all cursor-pointer float-end hover:text-red-500 after:transition-all after:delay-200 hover:after:text-sm after:content-['Eliminar'] after:text-[0px] after:underline text-gray-400 text-sm"
        >
          <i className="fa-solid fa-trash"></i>
        </div>
      </OpenCard>
    </div>
  );
};

export default Notifications;
