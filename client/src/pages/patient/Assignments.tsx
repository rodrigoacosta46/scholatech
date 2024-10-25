import React, { useEffect, useState } from "react";
import Title from "../../components/Title";
import { userHook } from "../../hooks/userHook";
import Section from "../../components/Section";
import Modal from "../../components/Modal";
import Scroller from "../../components/Scroller";
import axios from "axios";

const Assignments = () => {
  const { userConfig } = userHook();
  const [modal, setModalState] = useState(false);
  //const [formChange, setFormChange] = useState(false);

  const invalidImgHandler = (e) => {
    e.target.src = "img/logo.png";
  };
//Datos falsos


const pagination = async () => {
  try {
    const result = await axios.post(
      "http://localhost:8000/getTurnos/rejected",
      { Page: 1 },
      { withCredentials: true }
    );
    var response = result.data;
    var parsed = JSON.parse(response.message);
    var drugsParsed = JSON.parse(parsed.object);
    console.log(drugsParsed, parsed.total);
  } catch (error) {
    console.error("Error de consulta", error);
    console.log("Resultados JSON");
    console.log(error.response?.data);
    var response = error.response?.data;

    if (response.hasOwnProperty("redirect_route")) {
      console.log("REDIRECT ROUTE");
      window.location.href = response.redirect_route;
    } else {
      console.log("NO REDIRECT ROUTE");
    }
    if (response.hasOwnProperty("message")) {
      console.log("THERE IS A MESSAGE");
    }
  }
};


const registros = [
  {
      nombre: "Laura Fernández",
      contacto: "laura.fernandez@gmail.com",
      motivo: "Chequeo de rutina",
      fecha: "01/03/22 10:00:00",
      assigned: "03/04/22 19:00:00",
      notas: "Me siento bien, pero tengo algunas dudas sobre mi dieta."
  },
  {
      nombre: "Ricardo Gómez",
      contacto: "ricardo.gomez@gmail.com",
      motivo: "Dolor en la rodilla",
      fecha: "02/03/22 14:30:00",
      assigned: "03/04/22 19:00:00",
      notas: "He estado corriendo mucho últimamente. ¿Debería hacer una pausa?"
  },
  {
      nombre: "Sofía Martínez",
      contacto: "sofia.martinez@gmail.com",
      motivo: "Alergias estacionales",
      fecha: "03/03/22 11:15:00",
      assigned: "03/04/22 19:00:00",
      notas: "Los medicamentos no parecen estar funcionando, ¿debería cambiar?"
  },
  {
      nombre: "Diego Torres",
      contacto: "diego.torres@gmail.com",
      motivo: "Problemas digestivos",
      fecha: "04/03/22 09:00:00",
      assigned: "03/04/22 19:00:00",
      notas: "Creo que ciertos alimentos me están causando malestar."
  },
  {
      nombre: "Claudia Ramírez",
      contacto: "claudia.ramirez@gmail.com",
      motivo: "Dolores de cabeza frecuentes",
      fecha: "05/03/22 13:45:00",
      assigned: "03/04/22 19:00:00",
      notas: "Me gustaría saber si hay algo que pueda hacer para prevenirlos."
  }
];


  const start = 4;
  const [qry, setQry] = useState({
    "s-1": start,
    "s-2": start,
    "s-3": start,
  });
  const handle = (field) => {
    console.log(field);
    setQry({ ...qry, [field]: qry[field] + 3 });
  };
  useEffect(() => {
    pagination()

    console.log("hola", qry);
  }, [qry]);
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
            <button className="p-2 px-4 bg-green-600 text-white">
              Si
            </button>
            <button className="p-2 px-4 bg-red-600 text-white">
              No
            </button>
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
        <Scroller loader={() => handle("s-1")} className="animate-[slideIn_2s] my-2">
          {Array.from({ length: qry["s-1"] }).map((_,i) => (
            <div key={"k"+i} className="opacity-0 animate-fadeIn flex flex-col flex-shrink-0 max-w-[280px] h-fit bg-white rounded-xl shadow-[2px_2px] shadow-gray-400 p-4">
              <img
                src="localhost"
                onError={invalidImgHandler}
                alt=""
                className="w-auto max-h-full"
              />
              <p className="text-blue-700 text-center font-extralight text-lg">
                {registros[i%registros.length].nombre}
              </p>
              <div className="flex flex-col p-2 pt-3 gap-2">
                <p className="text-slate-600 font-extralight break-all">
                  Contacto:
                  <span className="float-end">{registros[i%registros.length].contacto}</span>
                </p>
                <p className="text-slate-600 font-extralight">
                  Motivo:
                  <span className="float-end">{registros[i%registros.length].motivo}</span>
                </p>
                <p className="text-slate-600 font-extralight">
                  Fecha:
                  <span className="float-end">{registros[i%registros.length].fecha}</span>
                </p>
                <details className="group cursor-pointer my-2 border-2 border-dashed border-slate-400 p-2 text-gray-400 open:text-slate-700 open:border-blue-400">
                  <summary className="flex items-center justify-between transition-all duration-500 group-open:mb-2 list-none ">
                    Notas adicionales
                    <i className="fa-solid fa-chevron-down float-end text-sm transition-all rotate-180 group-open:rotate-0 group-open:text-blue-600"></i>
                  </summary>
                  <p className="text-justify break-all">
                    {registros[i%registros.length].notas}
                  </p>
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
            </div>
          ))}
        </Scroller>

        <Section
          txt="Pendientes"
          icon={<i className="fa-solid fa-clock"></i>}
          scheme={userConfig.theme}
        />
        <Scroller loader={() => handle("s-2")} className="animate-[slideIn_2s] my-2">
          {Array.from({ length: qry["s-2"] }).map((_,i) => (
            <div key={"k"+i} className="relative animate-fadeIn flex flex-col flex-shrink-0 max-w-[280px] h-fit p-4 bg-white rounded-xl shadow-[2px_2px] shadow-gray-400 transition-all [&:has(>label>input:checked)]:shadow-red-500">
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
              {registros[i%registros.length].nombre}
              </p>
              <div className="flex flex-col p-2 pt-3 gap-2">
                <p className="text-slate-600 font-extralight break-all">
                  Contacto:
                  <span className="float-end">{registros[i%registros.length].contacto}</span>
                </p>
                <p className="text-slate-600 font-extralight">
                  Motivo:
                  <span className="float-end">{registros[i%registros.length].motivo}</span>
                </p>
                <p className="text-slate-600 font-extralight">
                  Fecha:
                  <span className="float-end">{registros[i%registros.length].fecha}</span>
                </p>
                <p className="text-slate-600 font-extralight">
                  F.Asignada:
                  <span className="float-end">{registros[i%registros.length].assigned}</span>
                </p>
                <details className="group cursor-pointer my-2 border-2 border-dashed border-slate-400 p-2 text-gray-400 open:text-slate-700 open:border-blue-400">
                  <summary className="flex items-center justify-between transition-all duration-500 group-open:mb-2 list-none ">
                    Notas adicionales
                    <i className="fa-solid fa-chevron-down float-end text-sm transition-all rotate-180 group-open:rotate-0 group-open:text-blue-600"></i>
                  </summary>
                  <p className="text-justify break-all">
                    {registros[i%registros.length].notas}
                  </p>
                </details>
                <button className="bg-slate-800 text-white rounded-lg p-2">
                	<i className="fa-solid fa-clipboard me-1"></i>
                	Realizar diagnostico
                </button>
              </div>
            </div>
          ))}
        </Scroller>
      </div>
    </>
  );
};

export default Assignments;
