import OpenCard from "../../components/OpenCard";
import VerticalScroller from "../../components/VerticalScroller";
import Title from "../../components/Title";
import Section from "../../components/Section";
import { userHook } from "../../hooks/userHook";
import React from "react";

const Story = () => {
  const { userConfig } = userHook();

  const pendingAssigmentsModel = (registro, i) => {
    let createdAt = new Date(registro.CreatedAt).toLocaleString();
    return (
      <OpenCard
        key={"n-" + i}
        style={{ animationDelay: (i % 10) * 0.05 + "s" }}
        className="animate-slideIn my-4 text-center opacity-0"
        icon={<i className="fa-solid fa-clock text-gray-400"></i>}
        title={
          <div className="ps-2 text-slate-700">
            Turno sin asignar &nbsp;
            <span className="font-bold">{createdAt}</span>
          </div>
        }
        content={
          <div className="mt-4 m-6 flex flex-wrap justify-evenly gap-3">
            <p className="font-bold">
              Doctor solicitado:
              <span className="ms-2 font-normal">
                {registro.Doctor.Username}
              </span>
            </p>
            <p className="font-bold">
              Motivo:
              <span className="ms-2 font-normal">{registro.Motivo}</span>
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
              <span className="ms-2 font-normal">{createdAt}</span>
            </p>
          </div>
        }
      />
    );
  };

  const assignedAssigmentModel = (registro, i) => {
    return (
      <OpenCard
        key={"m-" + i}
        style={{ animationDelay: (i % 10) * 0.05 + "s" }}
        className="animate-slideIn my-4 text-center opacity-0"
        icon={
          <i className="fa-solid fa-clipboard-list text-xl text-gray-700"></i>
        }
        title={
          <div className="ps-2 text-slate-700">
            Turno con el especialista {registro.Doctor.Username}
          </div>
        }
        content={
          <div className="mt-4 m-6 flex flex-wrap justify-evenly gap-3">
            <p className="font-bold">
              Doctor asignado:
              <span className="ms-2 font-normal">
                {registro.Doctor.Username}
              </span>
            </p>
            <p className="font-bold">
              Motivo:
              <span className="ms-2 font-normal">{registro.Motivo}</span>
            </p>
            <p className="font-bold">
              Fecha asignada:
              <span className="ms-2 font-normal">
                {new Date(registro.Fecha).toLocaleString()}
              </span>
            </p>
            <p className="font-bold">
              Fecha de pedido de consulta:
              <span className="ms-2 font-normal">
                {new Date(registro.CreatedAt).toLocaleString()}
              </span>
            </p>
          </div>
        }
      />
    );
  };

  const closedAssigmentModel = (registro, i) => {
    console.log(registro);
    return (
      <OpenCard
        key={"o-" + i}
        style={{ animationDelay: (i % 10) * 0.05 + "s" }}
        className="animate-slideIn my-4 text-center opacity-0"
        icon={<i className="fa-solid fa-check-to-slot text-green-800"></i>}
        title={
          <div className="ps-2 text-slate-700">
            Turno {registro.Turno.Doctor.Username}{" "}
            <span className="font-bold">
              {new Date(registro.CreatedAt).toLocaleString()}
            </span>
          </div>
        }
        content={
          <div className="relative pt-4 p-8">
            <div className="flex flex-wrap justify-evenly gap-3">
              <p className="font-bold">
                Doctor asignado:
                <span className="ms-2 font-normal">
                  {registro.Turno.Doctor.Username}
                </span>
              </p>
              <p className="font-bold">
                Motivo:
                <span className="ms-2 font-normal">
                  {registro.Turno.Motivo}
                </span>
              </p>
              <p className="font-bold">
                Fecha asignada:
                <span className="ms-2 font-normal">
                  {new Date(registro.Turno.Fecha).toLocaleString()}
                </span>
              </p>
              <p className="font-bold">
                Fecha de pedido de consulta:
                <span className="ms-2 font-normal">
                  {new Date(registro.Turno.CreatedAt).toLocaleString()}
                </span>
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
                <span className="ms-2 font-normal">{registro.Diagnostico}</span>
              </p>
              <p className="font-bold">
                Notas:
                <span className="ms-2 font-normal">{registro.Notas}</span>
              </p>
              {registro.Recetas != null && (
                <div className="font-bold">
                  Medicación asignada:
                  <ul className="ms-2 font-normal underline list-disc">
                    {registro.Recetas.map((drug, k) => (
                      <li key={"drug-" + k} title="Para más información, puede buscar la medicación en información sobre medicamentos">{drug.Medicamento.Nombre}.....{drug.Cantidad}.....{drug.Tomas}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        }
      />
    );
  };
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
            icon={<i className="fa-solid fa-clock"></i>}
            scheme={userConfig.theme}
          />
          <VerticalScroller
            url="http://localhost:8000/getTurnos/pending"
            renderModel={pendingAssigmentsModel}
            empty="No tenes asignaciones pendientes"
          />
        </div>
        <div>
          <Section
            txt="Turnos Asignados"
            icon={<i className="fa-solid fa-clipboard-list"></i>}
            scheme={userConfig.theme}
          />
          <VerticalScroller
            url="http://localhost:8000/getTurnos/accepted"
            renderModel={assignedAssigmentModel}
            empty="No tenes turnos asignados pendientes"
          />
        </div>
        <div>
          <Section
            txt="Turnos Pasados"
            icon={<i className="fa-solid fa-box-archive"></i>}
            scheme={userConfig.theme}
          />
          <VerticalScroller
            url="http://localhost:8000/getResults"
            renderModel={closedAssigmentModel}
            empty="No tenes turnos pasados"
          />
        </div>
      </div>
    </>
  );
};

export default Story;
