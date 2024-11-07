import { useLocation, useNavigate } from "react-router-dom";
import Card from "../../components/Card";
import Title from "../../components/Title";
import { userHook } from "../../hooks/userHook";
import React, { useEffect, useState } from 'react';
import useFetch from "../../hooks/useFetch";

interface SelectRequest {
  DoctorID: number,
  Motivo:   string,
  Detalles: string,
}

const Select = () => {
  const { userConfig } = userHook();
  const { state } = useLocation();
  const nav = useNavigate();
  const { ID, Username, Description, Speciality } = state || {};
  const [formData, setFormData] = useState<SelectRequest>({
    DoctorID: ID,
    Motivo: "",
    Detalles: "",
  });
  const { fetcher, response, error } = useFetch("http://localhost:8000/assignDoctor", { ...formData });

  const customValiditySettings = {
    Motivo: "El texto no debe superar los 30 caracteres",
    Detalles: "Los detalles no deben superar los 250 caracteres"
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    e.target.setCustomValidity("");
    if (!e.target.validity.valid) return e.target.setCustomValidity(customValiditySettings[name]);
    setFormData({ ...formData, [name]: value});
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    fetcher();
  }

  useEffect(() => {
    if (error != null && error.response.data) return alert(error.response.data.message);

    if (response != null) {
      if ((response).hasOwnProperty("redirect_route")) {
        console.log("REDIRECT ROUTE")
        window.location.href = response.redirect_route;
      }
    }
  }, [response, error]);

  useEffect(() => {
   if (state == null) {
    nav("/profile");
   } 
  }, []);

  return (
    <>
      <div className="flex flex-col items-center m-4 gap-4">
        <p className="text-green-900 text-3xl underline underline-offset-8 decoration-1 font-thin">
          Formulario de Consulta
        </p>
        <div className="grid lg:grid-cols-2 rounded-xl  bg-slate-200">
          <Card scheme={userConfig.theme}>
            <div className="group flex justify-center max-h-96 overflow-hidden cursor-pointer">
              <div>
                <img
                  src={`http://localhost:8000/getImage/profiles/${ID}/${ID}`}
                  alt=""
                  className="h-80 object-cover"
                />
                <p className="underline underline-offset-4 decoration-green-900 mt-4 text-center">
{                  Username
}                </p>
              </div>
              <div className="h-0 text-center text-green-900 transition-all duration-500 font-thin max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100">
                <div className="text-end text-lg p-3">
                  <Title
                    txt="Datos del especialista"
                    className=""
                    allowAnimations={true}
                    scheme={userConfig.theme}
                  />
                </div>
                <p>
                  <span className="font-bold">Nombre:</span> {Username}
                </p>
                <p>
                  <span className="font-bold">Ocupación:</span> {Speciality || "No especificada"}
                </p>
                <p>
                  <span className="font-bold">Descripción:</span> {Description || "Sin descripción"}
                </p>
              </div>
            </div>
          </Card>
          <form action="/story" onSubmit={handleSubmit}>
            <div className="p-8">
              <p className="text-lg my-2 text-slate-700">Motivo de consulta:</p>
              <input
                name="Motivo"
                type="text"
                maxLength={30}
                onChange={handleChange}
                placeholder="Dolor estomacal..."
                className="peer bg-gray-200 outline-none w-full shadow-[2px_1px] shadow-slate-400"
                required
              />
              <p className="text-lg mt-4 text-slate-700">Detalles:</p>
              <textarea
                name="Detalles"
                onChange={handleChange}
                placeholder="Escriba detalles de su consulta (opcional)"
                rows={5}
                cols={30}
                maxLength={250}
                className="w-full resize-none outline-none bg-gray-200 shadow-[2px_2px] shadow-slate-400"
              ></textarea>
              <input
                type="submit"
                value="Solicitar consulta"
                className="transition-all duration-500 p-4 my-4 text-slate-700 cursor-pointer bg-slate-300 block w-full shadow-[2px_2px] shadow-slate-400 active:shadow-none"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Select;
