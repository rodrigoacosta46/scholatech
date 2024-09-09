import Searchbar from "../components/Searchbar";
import Title from "../components/Title"

const Reminders = () => {
  return (
    <>
      <div className="text-2xl w-72 bg-slate-200 text-green-900 p-4 rounded-lg font-black m-2 shadow-[7px_7px] shadow-green-700">
        <Title txt="Notificaciones" allowAnimations={true}/>
      </div>

    <div className="flex flex-col p-8 gap-28">
        <div>
          <div className="relative h-px bg-slate-400 text-slate-500 after:content-['Hoy'] after:font-thin after:absolute after:end-1/2 after:-top-3 after:translate-x-1/2 after:bg-gray-300 after:px-2" />
          <div className="m-8">
            <div className="flex gap-2 divide-x items-center bg-white p-5 rounded-2xl shadow-[4px_4px] shadow-gray-400">
              <i class="fa-solid fa-circle-info text-xl"></i>
              <div className="ps-2">
                Tenes turno a las 13:00hs de este día.
              </div>
            </div>
          </div>
        </div> 
        <div>
          <div className="relative h-px bg-slate-400 text-slate-500 after:content-['Ayer'] after:font-thin after:absolute after:end-1/2 after:-top-3 after:translate-x-1/2 after:bg-gray-300 after:px-2" />
          <div className="m-8">
            <div className="flex gap-2 divide-x items-center bg-white p-5 rounded-2xl shadow-[4px_4px] shadow-gray-400">
              <i class="fa-solid fa-circle-check text-xl"></i>
              <div className="ps-2">
                Se aceptó turno de <span className="text-green-700">Cardiología</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="relative h-px bg-slate-400 text-slate-500 after:content-['2023/09/12'] after:font-thin after:absolute after:end-1/2 after:-top-3 after:translate-x-1/2 after:bg-gray-300 after:px-2" />
          <div className="m-8">
            <div className="flex gap-2 divide-x items-center bg-white p-5 rounded-2xl shadow-[4px_4px] shadow-gray-400">
              <i class="fa-solid fa-box-archive text-xl"></i>
              <div className="ps-2">
                Se ha añadido nueva entrada en tu historial de turnos
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reminders;
