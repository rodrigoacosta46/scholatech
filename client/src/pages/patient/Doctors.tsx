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

const Doctors = () => {
  const { userConfig } = userHook();
  const [doctors, setDoctors] = useState(0);
  const [modal, setModal] = useState(false);
  const modalSetState = () => {
    setModal(!modal);
  };

  const docPagination = () => {
    setDoctors((prev) => prev + 5);
  };

  useEffect(() => {
    docPagination();
  },[]);

  const getItems = () => {
    //Reemplazar por fetch api
    let items: React.JSX.Element[] = [];

    for (let i = 0; i < doctors; i++) {
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
          {i == 0 && 
            <div className="bg-gray-600/40 text-gray-400 absolute top-0 start-0 h-full w-full flex flex-col items-center justify-center">
              <i className="fa-solid fa-clock text-6xl"></i>
              Turno pendiente
            </div>
          }
        </Card>
      );
    }

    return items;
  }

  return (
    <>
      <Modal state={modal} setter={modalSetState} scheme={userConfig.theme}>
        <img
          src="img/Gaben.png"
          alt=""
          className="max-h-96 object-cover mx-auto block"
        />
        <div className="flex flex-col w-fit overflow-hidden">
          <Title txt="Dr. Octavio" className="" scheme={userConfig.theme} />
          <p className="m-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis
            blanditiis ut modi aliquid? Impedit obcaecati, voluptates mollitia
            molestias distinctio blanditiis nesciunt accusamus aliquam laborum
            atque ex. Velit illo maiores nostrum.
          </p>
          <Link
            className="p-2 bg-slate-400 rounded-3xl text-slate-800 text-bold text-center mt-auto"
            to="/select/id"
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
          <Scroller loader={docPagination} className="my-4 animate-[slideIn_1s]">{getItems().filter((_,i)=> i<5 )}</Scroller>
        </div>
        <div>
          <Section txt="Especialistas" scheme={userConfig.theme} />
          <div className="flex flex-wrap gap-2 justify-evenly items-center bg-green-950 text-white text-xl p-4 mt-3">
            Filtrar por:
            <Searchbar
              placeholder="Nombre del Especialista"
              className="p-2 text-lg"
            />
            <select
              name=""
              id=""
              className="bg-green-800 text-white p-2 outline-none"
              defaultValue="none"
            >
              <option value="none">Especialidad</option>
              <option value="">Cardiología</option>
              <option value="">Cardiología</option>
            </select>
            <select
              name=""
              id=""
              className="bg-green-800 text-white p-2 outline-none"
              defaultValue="none"
            >
              <option value="none">Género</option>
              <option value="">Masculino</option>
              <option value="">Femenino</option>
            </select>
          </div>
          <Scroller loader={docPagination} className="my-4">{getItems().filter((_,i) => i>0)}</Scroller>
        </div>
      </div>
    </>
  );
};

export default Doctors;
