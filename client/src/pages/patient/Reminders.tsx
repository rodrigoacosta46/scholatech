import Notifications from "../../components/Notifications";
import Title from "../../components/Title";
import { userHook } from "../../hooks/userHook";
import React, { useEffect, useState } from "react";

interface NotifCards {
  Today: React.ReactNode[],
  Last: React.ReactNode[],
  Long: React.ReactNode[]
}

const Reminders = () => {
  const { userConfig } = userHook();
  const [notifCards, setNotifCards] = useState<NotifCards>();

  function handleDelete(key) {
    console.log(key);
  }

  //Axios
  useEffect(() => {
    let items = [{}];
    for (let i = 0; i < 10; i++) {
      items[i] = {
        ID: i,
        Titulo: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore, commodi. Officia animi nostrum ea molestiae, illo voluptas vero odit consequatur dignissimos vitae fuga quibusdam rem facilis libero dolorum soluta quaerat.",
        Message: "Lorem ipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsum dolor, sit amet consectetur adipisicing elit. Tempore, commodi. Officia animi nostrum ea molestiae, illo voluptas vero odit consequatur dignissimos vitae fuga quibusdam rem facilis libero dolorum soluta quaer",
        Estado: i%2 == 0 ? "READ" : "UNREAD",
        CreatedAt: new Date(i)
      };
    }
    let store: NotifCards = {
      Today: [],
      Last: [],
      Long: []
    }
    items.forEach((v:any,i) =>{
      if(i < 4)
        return store.Today.push(<Notifications id={v.ID} title={v.Titulo} message={v.Message} state={v.Estado}></Notifications>);
      if(i < 7)
        return store.Last.push(<Notifications id={v.ID} title={v.Titulo} message={v.Message} state={v.Estado}></Notifications>);
      if(i > 6)
        return store.Long.push(<Notifications id={v.ID} title={v.Titulo} message={v.Message} state={v.Estado}></Notifications>);
    });
    console.log(items);
    setNotifCards(store);
  }, []);

  return (
    <>
      <Title
        txt="Notificaciones"
        allowAnimations={true}
        scheme={userConfig.theme}
      />

      <div className="flex flex-col gap-28 m-8">
        <div className="flex flex-col gap-4">
          <div className="relative h-px grow-0 bg-slate-400 text-slate-500 after:content-['Hoy'] after:font-thin after:absolute after:end-1/2 after:-top-3 after:translate-x-1/2 after:bg-gray-300 after:px-2"></div>
            {notifCards?.Today}
          </div>
        <div className="flex flex-col gap-4">
          <div className="relative h-px grow-0 bg-slate-400 text-slate-500 after:content-['Ayer'] after:font-thin after:absolute after:end-1/2 after:-top-3 after:translate-x-1/2 after:bg-gray-300 after:px-2"></div>
            {notifCards?.Last}
          </div>
        <div className="flex flex-col gap-4">
          <div className="relative h-px grow-0 bg-slate-400 text-slate-500 after:content-['2023/01/21'] after:font-thin after:absolute after:end-1/2 after:-top-3 after:translate-x-1/2 after:bg-gray-300 after:px-2"></div>
            {notifCards?.Long}
        </div>
      </div>
    </>
  );
};

export default Reminders;
