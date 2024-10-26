import React, { useState, useRef, useEffect } from "react";
import Title from "../../components/Title";
import Section from "../../components/Section";
import OpenCard from "../../components/OpenCard";
import { userHook } from "../../hooks/userHook";
import LoadSpinner from "../../components/LoadSpinner";
import VerticalScroller from "../../components/VerticalScroller";

const Treatments = () => {
  const { userInfo, userConfig } = userHook();
  const [data, setData] = useState(5);
  const [arrInputs, setArrInputs] = useState<React.ReactNode[]>([]);
  const pageContainer = useRef(null);
  const [formView, setFormView] = useState(false);
  const [formStorage, setFormStorage] = useState({
    motive: "",
    name: "",
    from: "",
    to: "",
  });
  const validateDate = (e) => {
    let value = e.target.value.toString();
    //let arr = value.split();
    //let date = Date.UTC(arr[2],arr[1],arr[0]);
    //console.log(value, date, e.target.name, arr);
    let reg = /\d{2}\/\d{2}\/\d{4}/;

    if (!reg.test(value)) {
      //console.log("xd1");
      return e.target.setCustomValidity(
        "Fecha inválida, el formato correcto es DD/MM/AAAA"
      );
    } /*else if (Number.isNaN(date)){
        console.log("xd");
        return e.target.setCustomValidity("Fecha inválida, el formato correcto es DD/MM/AAAA");
    }*/
    e.target.setCustomValidity("");
  };

  const changeData = (e) => {
    const { name, value } = e.target;
    setFormStorage({ ...formStorage, [name]: value });
    //setFormChange(true);
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (e.target.reportValidity()) console.log("id submit");
  };


  useEffect(() => {
    inRows();
  },[])
  
  const inRows = () => {
    setArrInputs(prev => 
      [...prev,
        <div className="flex gap-2" key={"k-"+arrInputs.indexOf(prev)+1}>          
          <select name="drug[]" className="outline-none">
            <option value="">Paracetamol</option>
            <option value="">Omeprazol</option>
            <option value="">Aspirina</option>
          </select>
          <input type="text" name="amount[]" placeholder="Cantidad" className="transition-all outline-blue-600 focus:outline-offset-2"/>
          <input type="text" name="time[]" placeholder="Cada cuanto" className="transition-all outline-blue-600 focus:outline-offset-2"/> 
        </div>
      ]
    );
  }

  const exRows = () => {
    let last = arrInputs.length-1;
    if(last != 0) setArrInputs(prev => prev.slice(0, last));
  }

  const treatModel = (registro, i) => {
    return(
      <OpenCard
          	key={"j-"+i}
            className="my-4 text-center animate-slideIn"
            icon={<i className="fa-solid fa-clipboard-check text-green-700"></i>}
            title={
              <div className="ps-2 text-slate-700">
                Raul Mazares <span className="font-bold">04/03/2024 18:30:00</span>
              </div>
            }
            content={
              <div className="relative pt-4 p-8">
                <div className="flex flex-wrap justify-evenly gap-3">
                  <p className="font-bold">
                    Doctor asignado:
                    <span className="ms-2 font-normal">Dr. Otaro</span>
                  </p>
                  <p className="font-bold">
                    Motivo:
                    <span className="ms-2 font-normal">Malestar al mover la cintura</span>
                  </p>
                  <p className="font-bold">
                    Fecha asignada:
                    <span className="ms-2 font-normal">04/03/2024 18:30:00</span>
                  </p>
                  <p className="font-bold">
                    Fecha de pedido de consulta:
                    <span className="ms-2 font-normal">02/02/2024 00:21:11</span>
                  </p>
                </div>
                <hr className="my-4" />
                <p className="text-2xl text-center">- Resultados -</p>
                <div className="relative bg-gray-200 flex flex-wrap justify-evenly text-center gap-3 p-12 my-2">
                  <button className="absolute end-2 bottom-2 text-sm text-gray-500">
                    <i className="fa-solid fa-download pe-1"></i>
                    Descargar comprobante
                  </button>
                  <p className="font-bold">
                    Diagnostico:
                    <span className="ms-2 font-normal">
                      Lesión lumbar
                    </span>
                  </p>
                  <p className="font-bold">
                    Notas:
                    <span className="ms-2 font-normal">
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ullam omnis ducimus a repellendus, vel, quia odit dolorem cupiditate, voluptatum consequuntur ab exercitationem sit. Mollitia animi eveniet fugit repellat! Harum, quos.
                    </span>
                  </p>
                  <div className="font-bold">
                    Medicación asignada:
                    <ul className="ms-2 font-normal underline list-disc">
                      <li>Medicación</li>
                      <li>Medicación</li>
                      <li>Medicación</li>
                      <li>Medicación</li>
                    </ul>
                  </div>
                </div>
              </div>
            }
          />
    )
  }
  return (
    <>
      <Title
        txt="Diagnosticos de paciente"
        allowAnimations={true}
        scheme={userConfig.theme}
      />

      <div className="relative m-12 space-y-32">
        <div className="overflow-hidden max-h-fit">
          <Section
            txt="Nuevo diagnostico"
            scheme={userConfig.theme}
            icon={
              <label htmlFor="checkView" className="cursor-pointer rounded-full text-white transition-all duration-500 underline underline-offset-4 space-x-1">
                <input type="checkbox" id="checkView" hidden={true} onChange={() => setFormView(!formView)} className="peer"/>
                <i className="fa-solid fa-minus transition-all duration-500 opacity-0 text-[0px] peer-checked:rotate-180 peer-checked:opacity-100 peer-checked:text-base"></i>
                <i className="fa-solid fa-plus transition-all duration-500 peer-checked:rotate-180 peer-checked:opacity-0 peer-checked:text-[0px]"></i>
                <span className="transition-all delay-200 text-[0px] peer-checked:text-lg">
                  Nuevo resultado
                </span>
              </label>
            }
          />
          <form
            className={`transition-all duration-500 ${
              formView
                ? "translate-y-0 opacity-100 h-full"
                : "-translate-y-full opacity-0 h-0"
            }`}
          >
            <OpenCard
              className="m-4 text-center"
              icon={<i className="fa-solid fa-clipboard text-slate-700"></i>}
              title={
                <div className="ps-2 text-slate-700 h-6">
                  Turno
                  <label
                    className="underline underline-offset-4 ms-2"
                    htmlFor="checkN"
                  >
                    <input
                      type="checkbox"
                      id="checkN"
                      hidden={true}
                      className="peer"
                    />
                    <span className="transition-all text-base peer-checked:text-[0px]">
                      Paciente
                    </span>
                    <input
                      type="text"
                      className="transition-all text-[0px] peer-checked:text-base outline-none border-b-[1px] border-blue-600 bg-transparent"
                      placeholder="Nombre del paciente"
                      required
                    />
                  </label>
                </div>
              }
              content={
                <div className="relative pt-4 p-8">
                  <div className="flex flex-wrap justify-evenly gap-3">
                    <p className="font-bold">
                      Doctor asignado:
                      <span className="ms-2 font-normal">{userInfo.Username}</span>
                    </p>
                    <label
                    className="underline underline-offset-4 ms-2"
                    htmlFor="checkMotive"
                  >
                    <input
                      type="checkbox"
                      id="checkMotive"
                      hidden={true}
                      className="peer"
                    />
                    <span className="transition-all text-base peer-checked:text-[0px]">
                      Motivo
                    </span>
                    <input
                      type="text"
                      className="transition-all text-[0px] peer-checked:text-base  outline-none border-b-[1px] border-blue-600 bg-transparent"
                      placeholder="Motivo de consulta"
                      required
                    />
                  </label>
                     <label
                    className="underline underline-offset-4 ms-2"
                    htmlFor="checkAss"
                  >
                    <input
                      type="checkbox"
                      id="checkAss"
                      hidden={true}
                      className="peer"
                    />
                    <span className="transition-all text-base peer-checked:text-[0px]">
                      Fecha asignada
                    </span>
                    <input
                      type="text"
                      className="transition-all text-[0px] peer-checked:text-base  outline-none border-b-[1px] border-blue-600 bg-transparent"
                      placeholder="Fecha de consulta"
                      required
                    />
                  </label> 
              	<label
                    className="underline underline-offset-4 ms-2"
                    htmlFor="checkSol"
                  >
                    <input
                      type="checkbox"
                      id="checkSol"
                      hidden={true}
                      className="peer"
                    />
                    <span className="transition-all text-base peer-checked:text-[0px]">
                      Fecha de solicitud
                    </span>
                    <input
                      type="text"
                      className="transition-all text-[0px] peer-checked:text-base  outline-none border-b-[1px] border-blue-600 bg-transparent"
                      placeholder="Solicitud de consulta"
                      required
                    />
                  </label> 
                  </div>
                  <hr className="my-4" />
                  <p className="text-2xl text-center">- Resultados -</p>
                  <div className="relative bg-gray-200 flex flex-wrap justify-evenly text-center gap-3 p-12 my-2 space-y-2">
                     <label
                    className="underline underline-offset-4 ms-2"
                    htmlFor="checkDi"
                  >
                    <input
                      type="checkbox"
                      id="checkDi"
                      hidden={true}
                      className="peer"
                    />
                    <span className="transition-all text-base peer-checked:text-[0px]">
                      Diagnostico
                    </span>
                    <input
                      type="text"
                      className="transition-all text-[0px] peer-checked:text-base outline-none border-b-[1px] border-blue-600 bg-transparent"
                      placeholder="Diagnostico final"
                      required
                    />
                  </label> 
                  <textarea placeholder="Notas" rows={5} className="w-full outline-none p-2"></textarea>
                  <div className="font-bold">
                    Medicación asignada: *opcional*
                    <div className="relative space-y-2 border-2 border-dashed border-slate-400 p-2 mt-3 w-full">
                      <div className="absolute end-0 -top-7">
                        <button onClick={inRows} className="bg-blue-950 text-white px-1 rounded-full"><i className="fa-solid fa-plus"></i></button>
                        <button onClick={exRows} className="bg-red-950 text-white px-1 rounded-full"><i className="fa-solid fa-minus"></i></button>
                      </div>
                      {
                        arrInputs
                      }
                    </div>
                  </div>
                  </div>
                  <input type="submit" value="...Registrar diagnostico"  className="cursor-pointer absolute end-0 bottom-0 italic underline underline-offset-4 text-blue-600"/>
                </div>
              }
            />
          </form>
        </div>
        <div>
          <Section txt="Resultados" scheme={userConfig.theme} />
          <form
          onSubmit={submitForm}
          className="flex flex-wrap gap-4 w-full bg-blue-700 justify-around items-center text-white my-4 p-5"
        >
          <label htmlFor="formSubmit" className="cursor-pointer select-none">
            <input
              type="submit"
              value="Filtrar"
              id="formSubmit"
              className="hidden"
            />
            <span
              className={`bg-blue-600 hover:bg-blue-900 transition-all text-lg p-4 rounded-lg`}
            >
              Filtrar
            </span>
          </label>
          <label htmlFor="checkMotive2" className="cursor-pointer">
            <input
              type="checkbox"
              hidden={true}
              id="checkMotive2"
              className="peer"
            />
            <input
              type="text"
              value={formStorage.motive}
              name="motive"
              placeholder="Motivo de consulta"
              onChange={changeData}
              className="transition-all duration-500 bg-transparent text-[0px] outline-none peer-checked:text-base peer-checked:ms-1 peer-checked:border-b-2"
            />
            <span className="transition-all duration-500 text-base peer-checked:text-[0px] hover:text-lg">
              Motivo
            </span>
          </label>
          <label htmlFor="checkUser" className="cursor-pointer">
            <input
              type="checkbox"
              hidden={true}
              id="checkUser"
              className="peer"
            />
            <input
              type="text"
              name="name"
              value={formStorage.name}
              placeholder="Nombre de usuario"
              onChange={changeData}
              className="transition-all duration-500 text-[0px] peer-checked:text-base ms-1 outline-none border-b-2 bg-transparent"
            />
            <span className="transition-all duration-500 text-base peer-checked:text-[0px] hover:text-lg">
              Nombre
            </span>
          </label>
          <label
            htmlFor="checkDate"
            className="cursor-pointer flex justify-center"
          >
            <input
              type="checkbox"
              hidden={true}
              id="checkDate"
              className="peer"
            />
            <input
              type="text"
              value={formStorage.from}
              name="from"
              placeholder="Desde..."
              pattern="\d{2}/\d{2}/\d{4}"
              onChange={changeData}
              onInvalid={validateDate}
              className="transition-all duration-500 text-[0px] peer-checked:text-base ms-1 outline-none border-b-2 bg-transparent"
            />
            <input
              type="text"
              value={formStorage.to}
              name="to"
              placeholder="Hasta..."
              pattern="\d{2}/\d{2}/\d{4}"
              onChange={changeData}
              onInvalid={validateDate}
              className="transition-all duration-500 text-[0px] peer-checked:text-base ms-1 outline-none border-b-2 bg-transparent"
            />
            <span className="transition-all duration-500 text-base peer-checked:text-[0px] hover:text-lg">
              Fecha
            </span>
          </label>
        </form>
        <VerticalScroller 
          url="http://localhost:8000/getDoctors"
          renderModel={treatModel}
          empty="No tenes diagnosticos listados"
        />
        </div>
      </div>
    </>
  );
};

export default Treatments;
