import Card from "../../components/Card";
import Title from "../../components/Title";
import Searchbar from "../../components/Searchbar";
import Modal from "../../components/Modal";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userHook } from "../../hooks/userHook";
import Section from "../../components/Section";
import React from "react";
import Scroller from "../../components/Scroller";


interface Doctor {
  Address: string;
  Birthdate: string;
  CreatedAt: string;
  DeletedAt: string;
  Description: string;
  Email: string;
  Gender: string;
  ID: number;
  Speciality: string;
  Telephone: string;
  UpdatedAt: string;
  Username: string;
}

interface FilterInterface {
  Username: string,
  Gender: string,
  Speciality: string
}

const Doctors = () => {
  const { userConfig } = userHook();
  const [filters, setFilters] = useState<FilterInterface>();
  const [modal, setModal] = useState(false);
  const [modalData, setModalData] = useState<Doctor>();

  const handleFilterChange = (e) => {
    const {name, value} = e.target;
    let time = setTimeout(() => {
      setFilters((prev) => ({...prev!, [name]: value}));
      clearTimeout(time);
    }, 500);
  }

  const modalSetState = (data) => {
    if (data != null) setModalData(data);
    setModal(!modal);
  };

  const doctorsModel = (registro, i) => {
    return(
    <Card
      key={"k-"+i}
      onClick={() => modalSetState(registro)}
      className="relative opacity-0 animate-fadeIn flex flex-col flex-shrink-0 max-w-[280px] m-2 cursor-pointer overflow-hidden"
      scheme={userConfig!["theme"]}
    >
      <img
        src={process.env.REACT_APP_API_URL
  + `/getImage/profiles/${registro.ID}/${registro.ID}`}
        alt=""
        className="h-80 object-cover"
      />
      <p className="underline underline-offset-4 decoration-green-900 mt-4 text-center">
        {registro.Username}
      </p>
    </Card>);
  };
  const getItems = () => {
    //Reemplazar por fetch api
    let items: React.JSX.Element[] = [];

    for (let i = 0; i < 4; i++) {
      items.push(
        <Card
          key={"n-" + i}
          id={i}
          onClick={modalSetState}
          className="relative opacity-0 animate-fadeIn flex flex-col flex-shrink-0 max-w-[280px] cursor-pointer overflow-hidden"
          scheme={userConfig!["theme"]}
        >
          <img src="img/Gaben.png" alt="" className="h-80 object-cover" />
          <p className="underline underline-offset-4 decoration-green-900 mt-4 text-center">
            Dr. Octavio Pizarro
          </p>
          {i == 0 && (
            <div className="bg-gray-600/40 text-gray-400 absolute top-0 start-0 h-full w-full flex flex-col items-center justify-center">
              <i className="fa-solid fa-clock text-6xl"></i>
              Turno pendiente
            </div>
          )}
        </Card>
      );
    }

    return items;
  };

  return (
    <>
      <Modal state={modal} setter={modalSetState} scheme={userConfig.theme}>
        <img
          src={process.env.REACT_APP_API_URL
  + `/getImage/profiles/${modalData?.ID}/${modalData?.ID}`}
          alt=""
          className="h-80 object-cover"
        />
        <div className="flex flex-col w-full overflow-hidden">
          <Title
            txt={modalData?.Username}
            className=""
            scheme={userConfig.theme}
          />
          <p className="m-2">
            {modalData?.Description || "Sin descripción"}
          </p>
          <Link
            className="p-2 bg-slate-400 rounded-3xl text-slate-800 text-bold text-center mt-auto"
            to="/select"
            state={modalData}
          >
            <i className="fa-solid fa-stethoscope pe-[.5rem]"></i>
            Realizar consulta
          </Link>
        </div>
      </Modal>

      <Title
        txt="Nuestros Especialistas"
        allowAnimations={true}
        className="text-2xl w-96 bg-slate-200 text-green-900 p-4 rounded-lg font-black m-2 shadow-[7px_7px] shadow-green-700"
      />
      <div className="w-full p-14 mt-12 flex flex-col gap-y-11">
        <div>
          <Section txt="Últimos turnos" scheme={userConfig.theme} />
          <Scroller
            url={String(process.env.REACT_APP_API_URL
  + "/lastdoctor")}
            className="animate-[slideIn_2s] my-2"
            renderModel={doctorsModel}
            empty="No tuviste ningún turno"
          />
        </div>
        <div>
          <Section txt="Especialistas" scheme={userConfig.theme} />
          <div className="flex flex-wrap gap-2 justify-evenly items-center bg-green-950 text-white text-xl p-4 mt-3">
            Filtrar por:
            <Searchbar
              name="Username"
              onChange={handleFilterChange}
              placeholder="Nombre del Especialista"
              className="p-2 text-lg"
            />
            <Searchbar
              name="Speciality"
              onChange={handleFilterChange}
              placeholder="Especialidad"
              className="p-2 text-lg"
            />
            <select
              name="Gender"
              onChange={handleFilterChange}
              className="bg-green-800 text-white p-2 outline-none"
              defaultValue="none"
            >
              <option value="none">Género</option>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
            </select>
          </div>
          <Scroller
            url={String(process.env.REACT_APP_API_URL
  + "/getDoctors")}
            params={{...filters}}
            className="animate-[slideIn_2s] my-2"
            renderModel={doctorsModel}
            empty="No se encontraron resultados"
          />
        </div>
      </div>
    </>
  );
};

export default Doctors;
