import Title from "../../components/Title";
import Searchbar from "../../components/Searchbar";
import Card from "../../components/Card";
import Modal from "../../components/Modal";
import { userHook } from "../../hooks/userHook";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { roles } from "../../config/roles";
import useFetch from "../../hooks/useFetch";
import LoadSpinner from "../../components/LoadSpinner";
import VerticalScroller from "../../components/VerticalScroller";

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
  const [searchTerm, setSearchTerm] = useState({
    Search: ""
  }); // Estado para el término de búsqueda
  const [adminModal, setAdminModal] = useState(false);
  const [drugView, setDrugView] = useState<DrugInterface>();
  const [imgSrc, setImgSrc] = useState("");

  const handleSearch = (e: any) => {
    let time = setTimeout(() => {
      setSearchTerm({ Search: e.target.value });
      clearTimeout(time);
    }, 500);
  }

  const modalSetState = (display: any) => {
    setDrugView(display);
    setModal(!modal);
  };

  const addDrug = (e: any) => { };
  const deleteDrug = (e: any) => {
    e.stopPropagation();
    confirm("Elimino medicamento");
  };

  const drugModel = (registro: any, i: any) => {
    return (
      <Card
        key={"n-" + i}
        onClick={() => modalSetState(registro)}
        style={{ animationDelay: i%10 * 0.05 + "s" }}
        className="opacity-0 animate-fadeIn cursor-pointer relative overflow-hidden"
        scheme={userConfig.theme}
      >
        {userInfo.Perfil.Name == "Admin" && (
          <i
            onClick={deleteDrug}
            className="fa-solid fa-trash absolute end-1 hover:text-red-700 transition-all"
          ></i>
        )}
        <img src={process.env.REACT_APP_API_URL
 + `/getImage/drugs/${registro.ID}/0`} onError={(e: any) => e.target.src = "img/logo.png"} alt="" className="w-auto max-h-96" />
        <Title
          txt={registro.Nombre}
          className="overflow-hidden"
          scheme={userConfig.theme}
        />
        <p className="text-slate-500 m-2 break-all line-clamp-4">
          {registro.Descripcion}
        </p>
      </Card>
    )
  }

  const viewFile = (e: any) => {
    const file = e.target.files[0];
    if (!file) return setImgSrc("");
    const tmp = window.URL.createObjectURL(file);
    console.log(file, tmp, e.target);
    setImgSrc(tmp);
  }

  /*

  useEffect(() => {
    pagination();
  }, [page]);
*/

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
                className="relative flex flex-col text-center text-2xl text-slate-400 cursor-pointer"
              >
                <div className={`${imgSrc && "hidden"}`}>
                  <i className="fa-solid fa-file-arrow-up"></i>
                  <span className="block text-sm">Subir archivo</span>
                </div>
                <img src={imgSrc} className="animate-fadeIn" />
                <input
                  type="file"
                  name="file"
                  id="newDrugFile"
                  className="hidden"
                  onChange={(e) => viewFile(e)}
                  accept="image/png"
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
                className="text-center resize-none h-full outline-none p-px border border-red-700 focus:ring-1 ring-offset-4 ring-red-700 rounded-lg transition-all"
              ></textarea>
            </div>
          </form>
        </Modal>
      )}

      <Modal state={modal} setter={modalSetState} scheme={userConfig.theme}>
        <img src={process.env.REACT_APP_API_URL
 + `/getImage/drugs/${drugView?.ID}/0`} onError={(e: any) => e.target.src = "img/logo.png"} alt="" className="max-h-96 object-cover" />
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
        <Searchbar
          placeholder={"Buscar medicamento"}
          className="p-3 w-96 lg:ms-auto"
          onChange={handleSearch} // Actualiza el estado de búsqueda
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
        <VerticalScroller 
          url={String(process.env.REACT_APP_API_URL
  + "/getDrugs")} 
          params={searchTerm}
          renderModel={drugModel}
          empty="No hay drogas"
          className="grid place-content-center grid-cols-[repeat(auto-fit,250px)] gap-4 p-4"
        />
    </>
  );
};

export default Drugs;
