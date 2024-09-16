import OpenCard from "../../components/OpenCard";
import Title from "../../components/Title";

const Reminders = () => {
  return (
    <>
      <Title txt="Notificaciones" allowAnimations={true} />

      <div className="flex flex-col p-8 gap-28">
        <div>
          <div className="relative h-px bg-slate-400 text-slate-500 after:content-['Hoy'] after:font-thin after:absolute after:end-1/2 after:-top-3 after:translate-x-1/2 after:bg-gray-300 after:px-2" />
          <OpenCard
            className="m-8"
            title={
              <>
                <i className="fa-solid fa-circle-info text-xl"></i>
                <div className="ps-2">Tenes turno a las 13:00hs de este día.</div>
              </>
            }
            content={
              <div className="text-gray-500 m-3 ">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate voluptatem laborum ullam nulla, accusamus id delectus neque sapiente ipsum aspernatur totam porro illo corrupti in autem ab suscipit sunt praesentium!
              </div>
            }
          />
        </div>
        <div>
          <div className="relative h-px bg-slate-400 text-slate-500 after:content-['Ayer'] after:font-thin after:absolute after:end-1/2 after:-top-3 after:translate-x-1/2 after:bg-gray-300 after:px-2" />
          <OpenCard
            className="m-8"
            title={
              <>
                <i className="fa-solid fa-circle-check text-xl"></i>
                <div className="ps-2">
                  Se aceptó turno de{" "}
                  <span className="text-green-700">Cardiología</span>
                </div>
              </>
            }
            content={
              <div className="text-gray-500 m-3 ">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate voluptatem laborum ullam nulla, accusamus id delectus neque sapiente ipsum aspernatur totam porro illo corrupti in autem ab suscipit sunt praesentium!
              </div>
            }
          />
        </div>
        <div>
          <div className="relative h-px bg-slate-400 text-slate-500 after:content-['2023/09/12'] after:font-thin after:absolute after:end-1/2 after:-top-3 after:translate-x-1/2 after:bg-gray-300 after:px-2" />
          <OpenCard
            className="m-8"
            title={
              <>
                <i class="fa-solid fa-box-archive text-xl"></i>
                <div className="ps-2">
                  Se ha añadido nueva entrada en tu historial de turnos
                </div>
              </>
            }
            content={
              <div className="text-gray-500 m-3 ">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate voluptatem laborum ullam nulla, accusamus id delectus neque sapiente ipsum aspernatur totam porro illo corrupti in autem ab suscipit sunt praesentium!
              </div>
            }
          />
        </div>
      </div>
    </>
  );
};

export default Reminders;
