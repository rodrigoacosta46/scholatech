import Card from "../components/Card";
import Title from "../components/Title";
import Searchbar from "../components/Searchbar";
import { useNavigate } from "react-router-dom";

const Doctors = () => {
  const navigate = useNavigate();
  const docs = getItems();

  function getItems() {
    //Reemplazar por fetch api
    let items = [];

    for (let i = 0; i < 19; i++) {
      items.push(
        <Card
          key={"n-" + i}
          onClick={() => {
            navigate("/docs/iddoc");
          }}
          style={{ animationDelay: i * 0.1 + "s" }}
          className="opacity-0 animate-fadeIn cursor-pointer"
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
      <div className="text-2xl w-96 bg-slate-200 text-green-900 p-4 rounded-lg font-black m-2 shadow-[7px_7px] shadow-green-700">
        <Title txt="Nuestros Especialistas" allowAnimations={true} />
      </div>
      <div className="w-full p-14 mt-12 flex flex-col gap-y-11">
        <div>
          <p className="border-b-2 border-green-900 text-2xl text-green-950 font-thin">
            Últimos turnos
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 gap-4">
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
          <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 gap-4">
            {docs}
          </div>
        </div>
      </div>
    </>
  );
};

export default Doctors;
