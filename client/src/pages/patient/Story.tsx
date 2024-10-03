import OpenCard from '../../components/OpenCard';
import Title from '../../components/Title';
import Section from '../../components/Section';
import { userHook } from '../../hooks/userHook';
import React, { useEffect } from 'react';


const Story = () => {
  const { userConfig } = userHook();
  return (
    <>
      <Title
        txt="Historial médico"
        allowAnimations={true}
        scheme={userConfig.theme}
      />

      <div className="flex flex-col gap-12 m-12">
        <div>
          <Section
            txt="Turnos Pendientes"
            icon={(<i className="fa-solid fa-clock absolute end-5"></i>).toString()}
            scheme={userConfig.theme}
          />
          <OpenCard
            className="m-4 text-center"
            title={
              <>
                <i className="fa-solid fa-clock text-gray-400"></i>
                <div className="ps-2 text-slate-700">Turno sin asignar</div>
              </>
            }
            content={
              <div className="mt-4 m-6 flex flex-wrap justify-evenly gap-3">
                <p className="font-bold">
                  Doctor asignado:
                  <span className="ms-2 font-normal">
                    pendiente
                    <i className="fa-solid fa-clock text-gray-400"></i>
                  </span>
                </p>
                <p className="font-bold">
                  Motivo:
                  <span className="ms-2 font-normal">N/a</span>
                </p>
                <p className="font-bold">
                  Fecha asignada:
                  <span className="ms-2 font-normal">
                    pendiente
                    <i className="fa-solid fa-clock text-gray-400"></i>
                  </span>
                </p>
                <p className="font-bold">
                  Fecha de pedido de consulta:
                  <span className="ms-2 font-normal">07/02/24</span>
                </p>
              </div>
            }
          />
        </div>
        <div>
          <Section
            txt="Turnos Asignados"
            icon={(<i className="fa-solid fa-clipboard-list absolute end-5"></i>).toString() }
            scheme={userConfig.theme}
          />
          <OpenCard
            className="m-4 text-center"
            title={
              <>
                <i className="fa-solid fa-clipboard-list text-xl text-gray-700"></i>
                <div className="ps-2 text-slate-700">
                  Turno con el especialista Eugene Gutierrez
                </div>
              </>
            }
            content={
              <div className="mt-4 m-6 flex flex-wrap justify-evenly gap-3">
                <p className="font-bold">
                  Doctor asignado:
                  <span className="ms-2 font-normal">Eugene Gutierrez</span>
                </p>
                <p className="font-bold">
                  Motivo:
                  <span className="ms-2 font-normal">Dolor estomacal</span>
                </p>
                <p className="font-bold">
                  Fecha asignada:
                  <span className="ms-2 font-normal">03/10/24</span>
                </p>
                <p className="font-bold">
                  Fecha de pedido de consulta:
                  <span className="ms-2 font-normal">07/04/24</span>
                </p>
              </div>
            }
          />
        </div>
        <div>
          <Section
            txt="Turnos Pasados"
            icon={(<i className="fa-solid fa-box-archive absolute end-5"></i>).toString()}
            scheme={userConfig.theme}
          />
          <OpenCard
            className="m-4 text-center"
            title={
              <>
                <i className="fa-solid fa-check-to-slot text-green-800"></i>
                <div className="ps-2 text-slate-700">
                  Turno Dr.Otaro <span className="font-bold">20/03/29</span>
                </div>
              </>
            }
            content={
              <div className="relative pt-4 p-8">
                <div className="flex flex-wrap justify-evenly gap-3">
                  <p className="font-bold">
                    Doctor asignado:
                    <span className="ms-2 font-normal">Dr Otaro</span>
                  </p>
                  <p className="font-bold">
                    Motivo:
                    <span className="ms-2 font-normal">Tensión abdominal</span>
                  </p>
                  <p className="font-bold">
                    Fecha asignada:
                    <span className="ms-2 font-normal">20/03/29 11:30:00</span>
                  </p>
                  <p className="font-bold">
                    Fecha de pedido de consulta:
                    <span className="ms-2 font-normal">07/02/24</span>
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
                      Torsión de músculo superior
                    </span>
                  </p>
                  <p className="font-bold">
                    Notas:
                    <span className="ms-2 font-normal">
                      Tomar cada medicación cada 12 días Lorem ipsum dolor sit,
                      amet consectetur adipisicing elit. Sequi, quibusdam
                      adipisci omnis sunt cum magni eaque, itaque aliquid ipsam
                      amet dolores recusandae suscipit dolorem quos laborum
                      voluptate eos neque inventore.
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
        </div>
      </div>
    </>
  );
};

export default Story;
