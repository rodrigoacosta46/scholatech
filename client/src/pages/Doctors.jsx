import Card from "../components/Card";
import Title from "../components/Title";
import Searchbar from "../components/Searchbar";
import Modal from "../components/Modal";
import { useState } from "react";

const Doctors = () => {
  const [modal, setModal] = useState(false);
  const modalSetState = () => {
    setModal(!modal);
  };

  const docs = getItems();

  function getItems() {
    //Reemplazar por fetch api
    let items = [];

    for (let i = 0; i < 10; i++) {
      items.push(
        <Card
          key={"n-" + i}
          onClick={modalSetState}
          style={{ animationDelay: i * 0.1 + "s" }}
          className="opacity-0 animate-fadeIn cursor-pointer overflow-hidden"
        >
          <img src="img/Gaben.png" alt="" className="h-80 object-cover" />
          <p className="underline underline-offset-4 decoration-green-900 mt-4 text-center">
            Dr. Octavio Pizarro
          </p>
        </Card>
      );
    }

    return items;
  }

  return (
    <>
      <Modal state={modal} setter={modalSetState}>
        <img
          src="img/Gaben.png"
          alt=""
          className="max-h-96 object-cover mx-auto block"
        />
        <div className="flex flex-col w-fit overflow-hidden">
          <Title txt="Dr. Octavio" className=""/>
          <p className="m-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis
            blanditiis ut modi aliquid? Impedit obcaecati, voluptates mollitia
            molestias distinctio blanditiis nesciunt accusamus aliquam laborum
            atque ex. Velit illo maiores nostrum.
          </p>
          <button className="p-2 bg-slate-400 rounded-3xl text-slate-800 text-bold mt-auto block">
            <i class="fa-solid fa-stethoscope pe-[.5rem]"></i>
            Realizar consulta
          </button>
        </div>
      </Modal>

      <Title
        txt="Nuestros Especialistas"
        allowAnimations={true}
        className="text-2xl w-96 bg-slate-200 text-green-900 p-4 rounded-lg font-black m-2 shadow-[7px_7px] shadow-green-700"
      />
      <div className="w-full p-14 mt-12 flex flex-col gap-y-11">
        <div>
          <p className="border-b-2 border-green-900 text-2xl text-green-950 font-thin">
            Últimos turnos
          </p>
          <div className="grid place-content-evenly grid-cols-[repeat(auto-fit,minmax(250px,1fr))] p-4 gap-4">
            <Card
              key={"n-"}
              onClick={modalSetState}
              className="relative opacity-0 animate-fadeIn cursor-pointer overflow-hidden"
            >
              <img src="img/Gaben.png" alt="" className="h-80 object-cover" />
              <p className="underline underline-offset-4 decoration-green-900 mt-4 text-center">
                Dr. Octavio Pizarro
              </p>
              <div className="bg-gray-600/40 text-gray-400 absolute top-0 start-0 h-full w-full flex flex-col items-center justify-center">
                <i class="fa-solid fa-clock text-6xl"></i>
                Turno pendiente
              </div>
            </Card>
            {docs.slice(0, 4)}
          </div>
        </div>
        <div>
          <p className="border-b-2 border-green-900 text-2xl text-green-950 font-thin">
            Especialistas
          </p>
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
            >
              <option value="" defaultValue>
                Especialidad
              </option>
              <option value="">Cardiología</option>
              <option value="">Cardiología</option>
            </select>
            <select
              name=""
              id=""
              className="bg-green-800 text-white p-2 outline-none"
            >
              <option value="" defaultValue>
                Género
              </option>
              <option value="">Masculino</option>
              <option value="">Femenino</option>
            </select>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] p-4 gap-4">
            {docs}
          </div>
        </div>
      </div>
    </>
  );
};

export default Doctors;
