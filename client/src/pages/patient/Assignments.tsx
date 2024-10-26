import React, { useEffect, useState } from "react";
import Title from "../../components/Title";
import { userHook } from "../../hooks/userHook";
import Section from "../../components/Section";
import Modal from "../../components/Modal";
import Scroller from "../../components/Scroller";

const Assignments = () => {
  const { userConfig } = userHook();
  const [modal, setModalState] = useState(false);

  //const [formChange, setFormChange] = useState(false);

  const invalidImgHandler = (e) => {
    e.target.src = "img/logo.png";
  };

  const pendingModel = (registros,i) => {
    <div key={"k-"+i} className="opacity-0 animate-fadeIn flex flex-col flex-shrink-0 max-w-[280px] h-fit bg-white rounded-xl shadow-[2px_2px] shadow-gray-400 p-4">
      <img
        src="localhost"
        onError={invalidImgHandler}
        alt=""
        className="w-auto max-h-full"
      />
      <p className="text-blue-700 text-center font-extralight text-lg">
        {registros.nombre}
      </p>
      <div className="flex flex-col p-2 pt-3 gap-2">
        <p className="text-slate-600 font-extralight break-all">
          Contacto:
          <span className="float-end">{registros.contacto}</span>
        </p>
        <p className="text-slate-600 font-extralight">
          Motivo:
          <span className="float-end">{registros.motivo}</span>
        </p>
        <p className="text-slate-600 font-extralight">
          Fecha:
          <span className="float-end">{registros.fecha}</span>
        </p>
        <details className="group cursor-pointer my-2 border-2 border-dashed border-slate-400 p-2 text-gray-400 open:text-slate-700 open:border-blue-400">
          <summary className="flex items-center justify-between transition-all duration-500 group-open:mb-2 list-none ">
            Notas adicionales
            <i className="fa-solid fa-chevron-down float-end text-sm transition-all rotate-180 group-open:rotate-0 group-open:text-blue-600"></i>
          </summary>
          <p className="text-justify break-all">{registros.notas}</p>
        </details>
        <div className="flex w-full gap-1 text-gray-300">
          <button className="bg-sky-600 rounded-lg p-2 grow relative transition-all delay-200 hover:text-white inset-0 hover:-inset-1 hover:shadow-[3px_3px] hover:shadow-blue-400">
            Aceptar turno
          </button>
          <button
            onClick={() => setModalState(true)}
            className="bg-red-600 rounded-lg p-2 transition-all hover:text-white"
            title="Descartar consulta"
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    </div>;
  };

  const acceptedModel = (registros, i) => {
    <div key={"j-"+i} className="relative animate-fadeIn flex flex-col flex-shrink-0 max-w-[280px] h-fit p-4 bg-white rounded-xl shadow-[2px_2px] shadow-gray-400 transition-all [&:has(>label>input:checked)]:shadow-red-500">
      <label className="cursor-pointer bg-red-600 absolute -top-1 end-1 rounded-lg p-2 text-white">
        <input type="checkbox" className="peer hidden" />
        <i className="fa-solid fa-ban transition-all duration-500 peer-checked:me-2 peer-checked:opacity-0 peer-checked:text-[0px]"></i>
        <i className="fa-solid fa-chevron-down opacity-0 text-[0px] transition-all duration-500 peer-checked:-rotate-90 peer-checked:animate-pulse peer-checked:me-2 peer-checked:opacity-100 peer-checked:text-base"></i>
        <button
          onClick={() => setModalState(true)}
          className="transition-all text-[0px] peer-checked:text-base hover:underline underline-offset-4"
        >
          Cancelar consulta?
        </button>
      </label>
      <img
        src="http://localhost:8000/getImage/profiles/7/7"
        onError={invalidImgHandler}
        alt=""
        className="w-auto max-h-full"
      />
      <p className="text-blue-700 text-center font-extralight text-lg">
        {registros.nombre}
      </p>
      <div className="flex flex-col p-2 pt-3 gap-2">
        <p className="text-slate-600 font-extralight break-all">
          Contacto:
          <span className="float-end">{registros.contacto}</span>
        </p>
        <p className="text-slate-600 font-extralight">
          Motivo:
          <span className="float-end">{registros.motivo}</span>
        </p>
        <p className="text-slate-600 font-extralight">
          Fecha:
          <span className="float-end">{registros.fecha}</span>
        </p>
        <p className="text-slate-600 font-extralight">
          F.Asignada:
          <span className="float-end">{registros.assigned}</span>
        </p>
        <details className="group cursor-pointer my-2 border-2 border-dashed border-slate-400 p-2 text-gray-400 open:text-slate-700 open:border-blue-400">
          <summary className="flex items-center justify-between transition-all duration-500 group-open:mb-2 list-none ">
            Notas adicionales
            <i className="fa-solid fa-chevron-down float-end text-sm transition-all rotate-180 group-open:rotate-0 group-open:text-blue-600"></i>
          </summary>
          <p className="text-justify break-all">{registros.notas}</p>
        </details>
        <button className="bg-slate-800 text-white rounded-lg p-2">
          <i className="fa-solid fa-clipboard me-1"></i>
          Realizar diagnostico
        </button>
      </div>
    </div>;
  };

  return (
    <>
      <Modal
        state={modal}
        setter={() => setModalState(!modal)}
        scheme={userConfig.theme}
      >
        <div className="col-span-2 space-y-8">
          <p className="text-xl text-yellow-400 underline underline-offset-8">
            Está seguro de querer realizar esta acción?
          </p>
          <div className="flex justify-around">
            <button className="p-2 px-4 bg-green-600 text-white">Si</button>
            <button className="p-2 px-4 bg-red-600 text-white">No</button>
          </div>
        </div>
      </Modal>
      <Title
        txt="Historial de consultas"
        scheme={userConfig.theme}
        allowAnimations={true}
      />

      <div className="p-12 space-y-8">
        <Section
          txt="Pedidos de Consulta"
          icon={<i className="fa-solid fa-clipboard-question"></i>}
          scheme={userConfig.theme}
        />
        <Scroller
          url="http://localhost:8000/getTurnos/pending"
          className="animate-[slideIn_2s] my-2"
          renderModel={pendingModel}
          empty="No tenes solicitudes de consulta pendientes"
        />
        <Section
          txt="Pendientes"
          icon={<i className="fa-solid fa-clock"></i>}
          scheme={userConfig.theme}
        />
        <Scroller
          url="http://localhost:8000/getTurnos/accepted"
          className="animate-[slideIn_2s] my-2"
          renderModel={acceptedModel}
          empty="No tenes consultas pendientes"
        />
      </div>
    </>
  );
};

export default Assignments;
