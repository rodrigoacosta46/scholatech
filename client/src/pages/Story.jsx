import OpenCard from "../components/OpenCard";
import Title from "../components/Title";

const Story = () => {
  return (
    <>
      <Title txt="Historial médico" allowAnimations={true} />

      <div className="m-12">
        <p className="relative border-b-2 border-green-900 text-2xl text-green-950 font-thin">
          Turnos pendientes
          <i className="fa-solid fa-clock absolute end-5"></i>
        </p>
        <OpenCard
          className="m-4"
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
        <p className="relative border-b-2 border-green-900 text-2xl text-green-950 font-thin mt-12">
          Turnos pasados
          <i className="fa-solid fa-box-archive absolute end-5"></i>
        </p>
        <OpenCard
          className="m-4"
          title={
            <>
              <i class="fa-solid fa-check-to-slot text-green-800"></i>
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
                  <span className="ms-2 font-normal">
                    Dr Otaro
                  </span>
                </p>
                <p className="font-bold">
                  Motivo:
                  <span className="ms-2 font-normal">Tensión abdominal</span>
                </p>
                <p className="font-bold">
                  Fecha asignada:
                  <span className="ms-2 font-normal">
                    20/03/29  11:30:00
                  </span>
                </p>
                <p className="font-bold">
                  Fecha de pedido de consulta:
                  <span className="ms-2 font-normal">07/02/24</span>
                </p>
              </div>
              <hr className="my-4" />
              <p className="text-2xl text-center">- Resultados -</p>
              <div className="relative bg-gray-200 flex flex-wrap justify-evenly gap-3 p-12 my-2">
                <button className="absolute end-2 bottom-2 text-sm text-gray-500">
                  <i class="fa-solid fa-download pe-1"></i>
                  Descargar comprobante
                </button>
                <p className="font-bold">
                  Diagnostico
                  <span className="ms-2 font-normal">Torsión de músculo superior</span>
                </p>
                <p className="font-bold">
                  Notas
                  <span className="ms-2 font-normal">Tomar cada medicación cada 12 días Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sequi, quibusdam adipisci omnis sunt cum magni eaque, itaque aliquid ipsam amet dolores recusandae suscipit dolorem quos laborum voluptate eos neque inventore.</span>
                </p>
                <p className="font-bold">
                  Medicación asignada:
                  <ul className="ms-2 font-normal underline list-disc">
                    <li>Medicación</li>
                    <li>Medicación</li>
                    <li>Medicación</li>
                    <li>Medicación</li>
                  </ul>
                </p>
              </div>
            </div>
          }
        />
      </div>
    </>
  );
};

export default Story;
