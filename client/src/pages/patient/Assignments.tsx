import React, { useEffect, useState } from "react";
import Title from "../../components/Title";
import { userHook } from "../../hooks/userHook";
import Section from "../../components/Section";
import Modal from "../../components/Modal";
import Scroller from "../../components/Scroller";
import useFetch from "../../hooks/useFetch";
import { Link } from "react-router-dom";

interface AcceptAsiggmentPOST {
  ID: number,
  Fecha: string,
  PacienteID: number
}

interface CancelAssigmentPOST {
  ID: number,
  PacienteID: number
}

const Assignments = () => {
  const { userConfig } = userHook();
  const [acceptedData, setAcceptedData] = useState<AcceptAsiggmentPOST>();
  const [cancelData, setCancelData] = useState<CancelAssigmentPOST>();
  const { response:acceptReqResponse, fetcher:fetchAccept, error:errorAccept } = useFetch("http://localhost:8000/updateAssigment/accept", {...acceptedData});
  const { response:cancelReqResponse, fetcher:fetchCancel, error:errorCancel } = useFetch("http://localhost:8000/updateAssigment/cancel", {...cancelData});
  const [modal, setModalState] = useState(false);
  const [reload, setReload] = useState(false);
  const [deleteCard, setDeleted] = useState<any>([]);
  const [deleteCardCan, setDeletedCan] = useState<any>([]);
  const [loadAction, setAction] = useState<() => void>();

  const invalidImgHandler = (e) => {
    e.target.src = "img/logo.png";
  };

  const formSubmit = (e) => {
    e.preventDefault();
    const fields = e.target.elements;
    let formData = {
      ID: parseInt(fields["ID"].value),
      Fecha: new Date(fields["Fecha"].value).toISOString(),
      PacienteID: parseInt(fields["PacienteID"].value)
    }
    setAcceptedData(formData);
  }

  useEffect(() => {
    if (acceptedData != null) {
      fetchAccept();
    } 
  }, [acceptedData]);

  useEffect(() => {
    if (cancelData != null) {
      fetchCancel();
    } 
  }, [cancelData]);

  useEffect(() => {
    if (errorAccept != null && errorAccept.response.data) {
      return alert(errorAccept.response.data.message);
    } 
    
    if (acceptReqResponse != null && acceptedData != undefined) {
      console.log(acceptReqResponse, errorAccept);
      setReload((prev) => !prev)
      setDeleted([...deleteCard, acceptedData.ID]);
    }
  }, [acceptReqResponse, errorAccept])

  useEffect(() => {
    if (errorCancel != null && errorCancel.response.data) {
      return alert(errorCancel.response.data.message);
    } 
    
    if (cancelReqResponse != null && cancelData != undefined) {
      console.log(cancelReqResponse, errorCancel);
      setDeletedCan([...deleteCardCan, cancelData.ID]);
    }
  }, [cancelReqResponse, errorCancel])

  const dateFormat = (date) => {
    return date.toLocaleDateString("sv",{year:'numeric', month:'numeric', day:'numeric', hour:'numeric', minute:'numeric'});
  }

  const minDate = dateFormat(new Date());
  const maxDate = dateFormat(new Date(Date.UTC(new Date().getFullYear()+1, new Date().getMonth(), new Date().getDate())));
  

  const pendingModel = (registros,i) => {
    return(
    <div key={"k-"+i} className={`overflow-hidden transition-all duration-500 flex flex-col flex-shrink-0 bg-white rounded-xl shadow-[2px_2px] shadow-gray-400 ${deleteCard.includes(registros.ID) ? "opacity-0 max-w-0 p-0 m-0 h-0" : "max-w-[280px] animate-fadeIn p-4 m-2"}`}>
      <img
        src={`http://localhost:8000/getImage/profiles/${registros.Paciente.ID}/${registros.Paciente.ID}`}
        onError={invalidImgHandler}
        alt=""
        className="w-auto max-h-full"
      />
      <p className="text-blue-700 text-center font-extralight text-lg">
        {registros.Paciente.Username}
      </p>
      <form className="flex flex-col p-2 pt-3 gap-2" onSubmit={formSubmit}>
        <p className="text-slate-600 font-extralight break-all">
          Contacto:
          <span className="float-end">{registros.Paciente.Email}</span>
        </p>
        <p className="text-slate-600 font-extralight">
          Motivo:
          <span className="float-end">{registros.Motivo}</span>
        </p>
        <details className="group cursor-pointer my-2 border-2 border-dashed border-slate-400 p-2 text-gray-400 open:text-slate-700 open:border-blue-400">
          <summary className="flex items-center justify-between transition-all duration-500 group-open:mb-2 list-none ">
            Notas adicionales
            <i className="fa-solid fa-chevron-down float-end text-sm transition-all rotate-180 group-open:rotate-0 group-open:text-blue-600"></i>
          </summary>
          <p className="text-justify break-all">{registros.Notas || "No hay notas adicionales"}</p>
        </details>
        <p className="text-slate-600 font-extralight">
          Asignar fecha:
          <input type="hidden" name="ID" value={registros.ID} />
          <input type="hidden" name="PacienteID" value={registros.Paciente.ID} />
          <input type="datetime-local" name="Fecha" min={minDate} max={maxDate} required/>
        </p>
        <div className="flex w-full gap-1 text-gray-300">
          <input type="submit" value="Aceptar turno" className="bg-sky-600 rounded-lg p-2 grow relative transition-all delay-200 hover:text-white inset-0 hover:-inset-1 hover:shadow-[3px_3px] hover:shadow-blue-400" />
          <button
            type="button"
            onClick={() => {setAction(() => () => setCancelData({ID: parseInt(registros.ID), PacienteID: parseInt(registros.Paciente.ID)}));setModalState(true)}}
            className="bg-red-600 rounded-lg p-2 transition-all hover:text-white"
            title="Descartar consulta"
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </form>
    </div>);
  };

  const acceptedModel = (registros, i) => {
    console.log("ENTRO A ACCEPTEDMODEL")
    console.log(registros)
    console.log(i)
    return(
    <div key={"j-"+i} className={`overflow-hidden relative animate-fadeIn flex flex-col flex-shrink-0 bg-white rounded-xl shadow-[2px_2px] shadow-gray-400 transition-all duration-500 [&:has(>label>input:checked)]:shadow-red-500 ${deleteCardCan.includes(registros.ID) ? "opacity-0 max-w-0 p-0 m-0 h-0" : "max-w-[280px] animate-fadeIn p-4 m-2"}`}>
      <label className="cursor-pointer bg-red-600 absolute -top-1 end-1 rounded-lg p-2 text-white">
        <input type="checkbox" className="peer hidden" />
        <i className="fa-solid fa-ban transition-all duration-500 peer-checked:me-2 peer-checked:opacity-0 peer-checked:text-[0px]"></i>
        <i className="fa-solid fa-chevron-down opacity-0 text-[0px] transition-all duration-500 peer-checked:-rotate-90 peer-checked:animate-pulse peer-checked:me-2 peer-checked:opacity-100 peer-checked:text-base"></i>
        <button
          onClick={() => setCancelData({ID: parseInt(registros.ID), PacienteID: parseInt(registros.Paciente.ID)})}
          className="transition-all text-[0px] peer-checked:text-base hover:underline underline-offset-4"
        >
          Cancelar consulta?
        </button>
      </label>
      <img
        src={`http://localhost:8000/getImage/profiles/${registros.Paciente.ID}/${registros.Paciente.ID}`}
        onError={invalidImgHandler}
        alt=""
        className="w-auto max-h-full"
      />
      <p className="text-blue-700 text-center font-extralight text-lg">
        {registros.Paciente.Username}
      </p>
      <div className={`flag flex flex-col p-2 gap-2 ${deleteCardCan.includes(registros.ID) && "hidden"}`}>
        <p className="text-slate-600 font-extralight break-all">
          Contacto:
          <span className="float-end">{registros.Paciente.Email}</span>
        </p>
        <p className="text-slate-600 font-extralight">
          Motivo:
          <span className="float-end">{registros.Motivo}</span>
        </p>
        <p className="text-slate-600 font-extralight">
          Fecha:
          <span className="float-end">{new Date(registros.CreatedAt).toLocaleString()}</span>
        </p>
        <p className="text-slate-600 font-extralight">
          F.Asignada:
          <span className="float-end">{new Date(registros.Fecha).toLocaleString()}</span>
        </p>
        <details className="group cursor-pointer my-2 border-2 border-dashed border-slate-400 p-2 text-gray-400 open:text-slate-700 open:border-blue-400">
          <summary className="flex items-center justify-between transition-all duration-500 group-open:mb-2 list-none ">
            Notas adicionales
            <i className="fa-solid fa-chevron-down float-end text-sm transition-all rotate-180 group-open:rotate-0 group-open:text-blue-600"></i>
          </summary>
          <p className="text-justify break-all">{registros.Notas || "No hay notas adicionales"}</p>
        </details>
        <Link to="/treatments" state={registros} className="bg-slate-800 text-white text-center rounded-lg p-2">
          <i className="fa-solid fa-clipboard me-1"></i>
          Realizar diagnostico
        </Link>
      </div>
    </div>);
  };

  const ExectLoadAction = () => {
    if (loadAction != undefined) {
      loadAction();
      setModalState(!modal);
    }
  }
  
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
            <button onClick={ExectLoadAction} className="p-2 px-4 bg-green-600 text-white">Si</button>
            <button onClick={() => setModalState(!modal)} className="p-2 px-4 bg-red-600 text-white">No</button>
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
          key={reload}
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
