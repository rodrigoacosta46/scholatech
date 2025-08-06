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
  Username: string;
  Gender: string;
  Speciality: string;
}

const Doctors = () => {
  const { userConfig } = userHook();
  const [filters, setFilters] = useState<FilterInterface>();
  const [filtersChanged, setFiltersChanged] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalData, setModalData] = useState<Doctor>();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    let time = setTimeout(() => {
      setFilters((prev) => ({ ...prev!, [name]: value }));
      setFiltersChanged((prev) => !prev);
      clearTimeout(time);
    }, 500);
  };

  const modalSetState = (data) => {
    if (data != null) setModalData(data);
    setModal(!modal);
  };

  const doctorsModel = (registro, i) => {
    return (
      <Card
        key={"k-" + i}
        onClick={() => modalSetState(registro)}
        className="relative flex flex-col flex-shrink-0 max-w-[280px] m-2 cursor-pointer overflow-hidden"
        scheme={userConfig!["theme"]}
      >
        <img
          src={
            process.env.REACT_APP_API_URL +
            `/getImage/profiles/${registro.ID}/${registro.ID}`
          }
          alt=""
          className="h-80 object-cover"
        />
        <p className="underline underline-offset-4 decoration-green-900 mt-4 text-center">
          {registro.Username}
        </p>
      </Card>
    );
  };

  return (
    <>
      <Modal state={modal} setter={modalSetState} scheme={userConfig.theme} cardStyles="min-h-80">
        <img
          src={
            process.env.REACT_APP_API_URL +
            `/getImage/profiles/${modalData?.ID}/${modalData?.ID}`
          }
          alt=""
          className="hidden md:block md:h-80 object-cover"
        />
        <div className="col-span-full md:col-span-1 flex flex-col w-full overflow-hidden">
          <Title
            txt={
              <>
                {modalData?.Username}
                <img
                  src={
                    process.env.REACT_APP_API_URL +
                    `/getImage/profiles/${modalData?.ID}/${modalData?.ID}`
                  }
                  alt=""
                  className="h-5 inline-block float-end"
                />
              </>
            }
            className=""
            scheme={userConfig.theme}
          />
          <p className="m-2 text-clip line-clamp-6">{modalData?.Description || "Sin descripción"}</p>
          <Link
            className="w-max p-2 px-4 bg-slate-400 rounded-xl text-slate-800 text-bold text-center mt-auto ms-auto"
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
        className="text-2xl w-96 bg-slate-200 text-green-900 p-4 rounded-lg font-black shadow-[7px_7px] shadow-green-700"
      />
      <div className="w-full p-4 lg:p-14 mt-12 flex flex-col gap-y-11">
        <div>
          <Section txt="Últimos turnos" scheme={userConfig.theme} />
          <Scroller
            url={String(process.env.REACT_APP_API_URL + "/lastdoctor")}
            className="animate-[slideIn_2s] my-2"
            renderModel={doctorsModel}
            empty="No tuviste ningún turno"
          />
        </div>
        <div className="min-h-[610px]">
          <Section txt="Especialistas" scheme={userConfig.theme} />
          <div className="flex flex-wrap gap-2 justify-evenly items-center bg-green-950 text-white text-xl p-4 mt-3">
            Filtrar por:
            <Searchbar
              name="Username"
              onChange={handleFilterChange}
              placeholder="Nombre del Especialista"
              className="p-2 grow"
            />
            <Searchbar
              name="Speciality"
              onChange={handleFilterChange}
              placeholder="Especialidad"
              className="p-2 grow"
            />
            <select
              name="Gender"
              onChange={handleFilterChange}
              className="bg-green-800 text-white p-2 outline-none grow"
              defaultValue="none"
            >
              <option value="none">Género</option>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
            </select>
          </div>
          <Scroller
            url={String(process.env.REACT_APP_API_URL + "/getDoctors")}
            params={{ ...filters }}
            className="animate-[slideIn_2s] my-2"
            renderModel={doctorsModel}
            empty="No se encontraron resultados"
            key={filtersChanged}
          />
        </div>
      </div>
    </>
  );
};

export default Doctors;
