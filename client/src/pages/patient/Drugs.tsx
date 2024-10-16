import Title from "../../components/Title";
import Searchbar from "../../components/Searchbar";
import Card from "../../components/Card";
import Modal from "../../components/Modal";
import { userHook } from "../../hooks/userHook";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { roles } from "../../config/roles";

interface DrugInterface {
  ID: number;
  Nombre: string;
  Descripcion: string;
  Imagen: string;
  CreatedAt: string;
  DeletedAt: string;
  UpdatedAt: string;
}

const Drugs = () => {
  // Por default, traer drogas más comunes
  // Tiene que haber un apartado para drogas ya usadas por le paciente
  const { userInfo, userConfig } = userHook();
  const [modal, setModal] = useState(false);
  const [page, setPage] = useState(1);
  const [displayedDrugs, setDisplayedDrugs] = useState<{
    display: DrugInterface[];
    total: number;
  }>({
    display: [],
    total: 0,
  });
  const [adminModal, setAdminModal] = useState(false);
  const [drugView, setDrugView] = useState<DrugInterface>();

  const modalSetState = (key) => {
    setDrugView(displayedDrugs.display[key])
    setModal(!modal);
  };

  const addDrug = (e) => {};
  const deleteDrug = (e) => {
    e.stopPropagation();
    confirm("Elimino medicamento");
  };

  const pagination = async () => {
    try {
      const result = await axios.post(
        "http://localhost:8000/getDrugs",
        { Page: page },
        { withCredentials: true }
      );
      var response = result.data;
      var parsed = JSON.parse(response.message);
      console.log(JSON.parse(parsed.drugs), parsed.total);
      setDisplayedDrugs({
        display: JSON.parse(parsed.drugs),
        total: parsed.total,
      });
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

  useEffect(() => {
    pagination();
  }, [page]);

  return (
    <>
      {userInfo.Perfil.Name == roles.admin && (
        <Modal
          state={adminModal}
          setter={() => {
            setAdminModal(!adminModal);
          }}
          scheme={userConfig.theme}
        >
          <form action="#" className="col-span-2 grid grid-cols-2">
            <div className="flex justify-center items-center p-14 border-4 border-dashed border-slate-400">
              <label
                htmlFor="newDrugFile"
                className="flex flex-col text-center text-2xl text-slate-400 cursor-pointer"
              >
                <i className="fa-solid fa-file-arrow-up"></i>
                <span className="text-sm">Subir archivo</span>
                <input
                  type="file"
                  name="file"
                  id="newDrugFile"
                  className="hidden"
                />
              </label>
            </div>
            <div className="flex flex-col items-center gap-4 p-4">
              <label htmlFor="newDrugTitle">
                <input
                  type="text"
                  name="title"
                  id="newDrugTitle"
                  placeholder="Nombre del medicamento"
                  className="outline-none text-slate-700"
                />
              </label>

              <textarea
                name=""
                id=""
                rows={4}
                placeholder="Descripción del medicamento"
                maxLength={1000}
                className="text-center resize-none outline-none p-px border border-red-700 focus:ring-1 ring-offset-4 ring-red-700 rounded-lg transition-all"
              ></textarea>
            </div>
          </form>
        </Modal>
      )}

      <Modal state={modal} setter={modalSetState} scheme={userConfig.theme}>
        <img src="img/logo.png" alt="" className="max-h-96 object-cover" />
        <div className="flex flex-col w-fit overflow-hidden">
          <Title txt={drugView?.Nombre} className="" scheme={userConfig.theme} />
          <p className="m-2">{drugView?.Descripcion}
          </p>
        </div>
      </Modal>

      <Title
        txt="Información sobre medicamentos"
        allowAnimations={true}
        scheme={userConfig.theme}
      />

      <div className="flex flex-wrap w-full text-end items-center justify-center gap-2 p-4">
        <div className={`flex justify-between bg-white text-${userConfig.theme}-600 gap-4 rounded-full p-2 text-2xl min-w-36 shadow-[2px_2px] shadow-${userConfig.theme}-800`}>
          <button onClick={()=>page != 1 && setPage(page-1)} className="transition-all duration-1000 peer">
            <i className="fa-solid fa-circle-left"></i>
          </button>
          <p key={Math.random()} className={`animate-fadeIn transition-all duration-100 peer-active:-translate-x-full peer-active:invisible [&:has(+button:active)]:translate-x-full [&:has(+button:active)]:invisible `}>{page}</p>
          <button onClick={()=>page != Math.ceil(displayedDrugs.total/10) && setPage(page+1)} className="">
            <i className="fa-solid fa-circle-right"></i>
          </button>
        </div>
        <Searchbar
          placeholder={"Buscar medicamento"}
          className="p-3 w-96 lg:ms-auto"
        />
        {userInfo.Perfil.Name == "Admin" && (
          <button
            onClick={() => setAdminModal(!adminModal)}
            className="flex bg-slate-700 text-white py-2 px-4 rounded-3xl"
          >
            + Añadir droga
          </button>
        )}

      </div>
      <div className="grid place-content-evenly grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 p-4">
        {displayedDrugs.display.map((drug, i) => (
          <Card
            key={"n-"+page+i}
            onClick={() => modalSetState(i)}
            style={{ animationDelay: i * 0.1 + "s" }}
            className="opacity-0 animate-fadeIn cursor-pointer relative overflow-hidden"
            scheme={userConfig.theme}
          >
            {userInfo.Perfil.Name == "Admin" && (
              <i
                onClick={deleteDrug}
                className="fa-solid fa-trash absolute end-1 hover:text-red-700 transition-all"
              ></i>
            )}
            <img src={`http://localhost:8000/getImage/drugs/${drug.ID}/3`} onError={(e:any) => e.target.src = "img/logo.png"} alt="" className="w-auto max-h-96"/>
            <Title
              txt={drug.Nombre}
              className="overflow-hidden"
              scheme={userConfig.theme}
            />
            <p className="text-slate-500 m-2 break-all line-clamp-4">
              {drug.Descripcion}
            </p>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Drugs;
