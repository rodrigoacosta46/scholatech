import Notifications from "../../components/Notifications";
import Title from "../../components/Title";
import { userHook } from "../../hooks/userHook";
import React, { act, useEffect, useState } from "react";

const Reminders = () => {
  const { userConfig } = userHook();
  const [notifCards, setNotifCards] = useState();

  function handleDelete(key) {
    console.log(key);
  }

  //Axios
  useEffect(() => {
    let items = [{}]; //fake data
    for (let i = 0; i < 10; i++) {
      items[i] = {
        ID: i,
        Titulo:
          "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore, commodi. Officia animi nostrum ea molestiae, illo voluptas vero odit consequatur dignissimos vitae fuga quibusdam rem facilis libero dolorum soluta quaerat.",
        Message:
          "Lorem ipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsumipsum dolor, sit amet consectetur adipisicing elit. Tempore, commodi. Officia animi nostrum ea molestiae, illo voluptas vero odit consequatur dignissimos vitae fuga quibusdam rem facilis libero dolorum soluta quaer",
        Estado: i % 2 == 0 ? "READ" : "UNREAD",
        CreatedAt: i < 4 ? Date.UTC(2024,9,14) : Date.UTC(2023,1,4),
      };
    }

    let store:any = [{}];

    let actualidad = Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    console.log(actualidad);


    let lastDate;
    items.forEach((v: any, i) => {
      store[i] = (
        <div key={"k-" + i}>
          {lastDate != v.CreatedAt && (
            <div
              className={`relative h-px my-2 grow-0 bg-slate-400 text-slate-500 text-lg mt-16`}
            >
              <span className="bg-gray-300 absolute -top-4 start-0 end-0 mx-auto w-fit pointer-events-none px-2">
                {v.CreatedAt == actualidad ? "Hoy" : new Date(v.CreatedAt).toLocaleDateString("es-ES")}
              </span>
            </div>
          )}
          <Notifications
            id={v.ID}
            title={v.Titulo}
            message={v.Message}
            state={v.Estado}
          ></Notifications>
        </div>
      );
      console.log(lastDate, actualidad, v.CreatedAt == actualidad)
      lastDate = v.CreatedAt;
    });
    setNotifCards(store);
  }, []);

  return (
    <>
      <Title
        txt="Notificaciones"
        allowAnimations={true}
        scheme={userConfig.theme}
      />

      <div className="flex flex-col gap-28 m-8 transition-all">
        <div className="flex flex-col">
          {notifCards}
        </div>
      </div>
    </>
  );
};

export default Reminders;
