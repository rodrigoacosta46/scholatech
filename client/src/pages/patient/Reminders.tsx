import OpenCard from '../../components/OpenCard';
import Title from '../../components/Title';
import { userHook } from '../../hooks/userHook';
import React, { useEffect } from 'react';

const Reminders = () => {
  const { userConfig } = userHook();

  const notifications = makeNotifs();

  function makeNotifs() {
    let items: React.JSX.Element[] = [];

    for(let i=0; i<10; i++) {
      items.push(
        <OpenCard
            className=""
            title={
              <>
                <i className="fa-solid fa-circle-info text-xl"></i>
                <div className="ps-2">
                  Tenes turno a las 13:00hs de este día.
                </div>
              </>
            }
            content={
              <div className="text-gray-500 m-3 ">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Voluptate voluptatem laborum ullam nulla, accusamus id delectus
                neque sapiente ipsum aspernatur totam porro illo corrupti in
                autem ab suscipit sunt praesentium!
              </div>
            }
          />
      )
    }
    return items;
  }

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
          {notifications.slice(0, 4)}
        </div>
        <div className="flex flex-col gap-4">
          <div className="relative h-px grow-0 bg-slate-400 text-slate-500 after:content-['Ayer'] after:font-thin after:absolute after:end-1/2 after:-top-3 after:translate-x-1/2 after:bg-gray-300 after:px-2"></div>
          {notifications.slice(0, 4)}
        </div>
        <div className="flex flex-col gap-4">
          <div className="relative h-px grow-0 bg-slate-400 text-slate-500 after:content-['2023/01/21'] after:font-thin after:absolute after:end-1/2 after:-top-3 after:translate-x-1/2 after:bg-gray-300 after:px-2"></div>
          {notifications.slice(0, 4)}
        </div>
      </div>
    </>
  );
};

export default Reminders;
