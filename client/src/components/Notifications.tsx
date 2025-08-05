import { useEffect, useState } from "react";
import OpenCard from "./OpenCard";
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
  + "/updateNotification/delete");
  const { response:successRead, fetcher:markAsRead, error:errorRead } = useFetch(process.env.REACT_APP_API_URL
  + "/updateNotification/read");
  const STATES = {
    "pendiente": "leido",
    "leido": "pendiente"
  }

  const handleReadState = (state, callback) => {
    if(read != state){
      callback();
    }
  }
  
  const verifyFetch = (error, success, callback) => {
    if (error != null && error.response.data) {
      return alert(error.response.data.message);
    } 
    
    if (success != null) {
      console.log(success, error);
      callback();
    }
  }

  useEffect(() => {
    verifyFetch(errorDiscard, successDiscard, () => setVisible(prev => !prev));
  }, [successDiscard, errorDiscard]);


  useEffect(() => {
    verifyFetch(errorRead, successRead, () => setReadState(STATES[read]));
  }, [successRead, errorRead]);
  
  return (
    <div
      className={`overflow-hidden rounded-3xl transition-[max-height] duration-1000
        ${
          !visible ? "flag max-h-0 p-px" : "max-h-96 p-2"
        }
        ${read === "pendiente" ? "animate-pulse text-yellow-400" : ""}
        `
     }
     onClick={() => handleReadState("leido", () => markAsRead({ID: props.id}))}
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
          onClick={() => handleReadState("pendiente", () => discard({ID: props.id}))}
          className="transition-all cursor-pointer float-end hover:text-red-500 after:transition-all after:delay-200 hover:after:text-sm after:content-['Eliminar'] after:text-[0px] after:underline text-gray-400 text-sm"
        >
          <i className="fa-solid fa-trash"></i>
        </div>
      </OpenCard>
    </div>
  );
};

export default Notifications;
