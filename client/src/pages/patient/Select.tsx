import Card from "../../components/Card";
import Title from "../../components/Title";
import { userHook } from "../../hooks/userHook";
import React from 'react';


const Select = () => {
  const { userConfig } = userHook();

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
                  src="../img/Gaben.png"
                  alt=""
                  className="h-80 object-cover"
                />
                <p className="underline underline-offset-4 decoration-green-900 mt-4 text-center">
                  Dr. Octavio Pizarro
                </p>
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
                  <span className="font-bold">Username:</span> Octavio Pizarro
                </p>
                <p>
                  <span className="font-bold">Ocupación:</span> Médico de
                  cabecera
                </p>
                <p>
                  <span className="font-bold">Descripción:</span> Lorem ipsum
                  dolor sit amet consectetur adipisicing elit. Ex molestias,
                  amet doloribus voluptatum dicta vel nisi quae aut eius modi
                  soluta consequuntur nobis rem dolor inventore omnis nihil
                  totam maxime.
                </p>
              </div>
            </div>
          </Card>
          <form action="/story">
            <div className="p-8">
              <p className="text-lg my-2 text-slate-700">Motivo de consulta:</p>
              <input
                type="text"
                placeholder="Dolor estomacal..."
                className="peer bg-gray-200 outline-none w-full shadow-[2px_1px] shadow-slate-400"
              />
              <p className="text-lg mt-4 text-slate-700">Detalles:</p>
              <textarea
                name=""
                id=""
                placeholder="Escriba detalles de su consulta (opcional)"
                rows={5}
                cols={30}
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
