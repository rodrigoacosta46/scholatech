import { useEffect, useState } from "react";
import OpenCard from "./OpenCard";
import React from "react";

interface NotificationsProps {
  id: string,
  title: string,
  message: string,
  state: string,
}

const Notifications = (props: NotificationsProps) => {
  const [visible, setVisible] = useState(true);
  const [read, setReadState] = useState(props.state);
  
  //Axios
  const handleDelete = () => {
    if(read != "UNREAD"){
      setVisible(!visible);
    }
  };

  //Axios
  const handleCardReadState = (e) => {
    let states = {
      "UNREAD": "READ",
      "READ": "UNREAD"
    }

    if (read != "READ") setReadState(states[read]);
  }

  return (
    <div
      className={`overflow-hidden rounded-3xl transition-all duration-1000
        ${
          !visible ? "flag max-h-0 p-px" : "max-h-96 p-2"
        }
        ${
          read == "UNREAD" && "animate-pulse text-yellow-400"
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
