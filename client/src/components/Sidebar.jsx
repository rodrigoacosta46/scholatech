const Sidebar = () => {
  return (
    <div className="flex flex-col fixed fixed-left w-64 h-full bg-green-950">
      <div className="h-full flex flex-col gap-12">
        <span className="cursor-pointer w-fit after:content-['Log_Out'] after:underline after:absolute after:translate-x-0 lg:after:-translate-x-full after:opacity-0 hover:after:translate-x-0 hover:after:opacity-100 after:transition-all text-gray-400 hover:text-red-400">
          <i className="fa-solid fa-arrow-right-from-bracket rotate-180 "></i>
        </span>
        <div className="w-full flex gap-2 p-2">
          <img
            src="img/Gaben.png"
            alt="Page LOGO"
            className="w-20 rounded-full"
          />
          <div className="flex flex-col">
            <p className="text-xl text-white text-wrap max-h-28 overflow-hidden me-2">
              Hernandez Gutierrez Nunez
            </p>
            <p className="text-sm text-gray-500">Paciente</p>
          </div>
        </div>
        <div
          className="scroll flex flex-col w-72 h-72 overflow-y-auto overflow-x-hidden"
          style={{ direction: 'rtl' }}
        >
          <div
            className="group w-64 hover:w-full flex self-end gap-[3px] text-slate-400 hover:text-white hover:bg-green-700 py-4 transition-all cursor-pointer"
            style={{ direction: 'ltr' }}
          >
            <div className="w-full text-center text-wrap transition-all px-2 relative">
              <i className="fa-sharp-duotone fa-solid fa-heart-circle-exclamation fa-light"></i>
              Información general
              <div className="absolute transition-all duration-500 bg-white h-px w-72 end-full group-hover:end-4"></div>
            </div>
          </div>
          <div
            className="group w-64 hover:w-full flex self-end gap-[3px] text-slate-400 hover:text-white hover:bg-green-700 py-4 transition-all cursor-pointer"
            style={{ direction: 'ltr' }}
          >
            <div className="w-full text-center text-wrap transition-all px-2 relative">
              <i className="fa-sharp-duotone fa-solid fa-heart-circle-exclamation fa-light"></i>
              listado de medicaciones que ingierio el paciente
              <div className="absolute transition-all duration-500 bg-white h-px w-72 end-full group-hover:end-4"></div>
            </div>
          </div>
          <div
            className="group w-64 hover:w-full flex self-end gap-[3px] text-slate-400 hover:text-white hover:bg-green-700 py-4 transition-all cursor-pointer"
            style={{ direction: 'ltr' }}
          >
            <div className="w-full text-center text-wrap transition-all px-2 relative">
              <i className="fa-sharp-duotone fa-solid fa-heart-circle-exclamation fa-light"></i>
              informacion de Drogas
              <div className="absolute transition-all duration-500 bg-white h-px w-72 end-full group-hover:end-4"></div>
            </div>
          </div>
          <div
            className="group w-64 hover:w-full flex self-end gap-[3px] text-slate-400 hover:text-white hover:bg-green-700 py-4 transition-all cursor-pointer"
            style={{ direction: 'ltr' }}
          >
            <div className="w-full text-center text-wrap transition-all px-2 relative">
              <i className="fa-sharp-duotone fa-solid fa-heart-circle-exclamation fa-light"></i>
              consultas medicas.
              <div className="absolute transition-all duration-500 bg-white h-px w-72 end-full group-hover:end-4"></div>
            </div>
          </div>
          <div
            className="group w-64 hover:w-full flex self-end gap-[3px] text-slate-400 hover:text-white hover:bg-green-700 py-4 transition-all cursor-pointer"
            style={{ direction: 'ltr' }}
          >
            <div className="w-full text-center text-wrap transition-all px-2 relative">
              <i className="fa-sharp-duotone fa-solid fa-heart-circle-exclamation fa-light"></i>
              registro de tomas de medicaciones
              <div className="absolute transition-all duration-500 bg-white h-px w-72 end-full group-hover:end-4"></div>
            </div>
          </div>
          <div
            className="group w-64 hover:w-full flex self-end gap-[3px] text-slate-400 hover:text-white hover:bg-green-700 py-4 transition-all cursor-pointer"
            style={{ direction: 'ltr' }}
          >
            <div className="w-full text-center text-wrap transition-all px-2 relative">
              <i className="fa-sharp-duotone fa-solid fa-heart-circle-exclamation fa-light"></i>
              Portal de informacion del medico.
              <div className="absolute transition-all duration-500 bg-white h-px w-72 end-full group-hover:end-4"></div>
            </div>
          </div>
          <div
            className="group w-64 hover:w-full flex self-end gap-[3px] text-slate-400 hover:text-white hover:bg-green-700 py-4 transition-all cursor-pointer"
            style={{ direction: 'ltr' }}
          >
            <div className="w-full text-center text-wrap transition-all px-2 relative">
              <i className="fa-sharp-duotone fa-solid fa-heart-circle-exclamation fa-light"></i>
              medicaciones del paciente
              <div className="absolute transition-all duration-500 bg-white h-px w-72 end-full group-hover:end-4"></div>
            </div>
          </div>
          <div
            className="group w-64 hover:w-full flex self-end gap-[3px] text-slate-400 hover:text-white hover:bg-green-700 py-4 transition-all cursor-pointer"
            style={{ direction: 'ltr' }}
          >
            <div className="w-full text-center text-wrap transition-all px-2 relative">
              <i className="fa-sharp-duotone fa-solid fa-heart-circle-exclamation fa-light"></i>
              calendario
              <div className="absolute transition-all duration-500 bg-white h-px w-72 end-full group-hover:end-4"></div>
            </div>
          </div>
          <div
            className="group w-64 hover:w-full flex self-end gap-[3px] text-slate-400 hover:text-white hover:bg-green-700 py-4 transition-all cursor-pointer"
            style={{ direction: 'ltr' }}
          >
            <div className="w-full text-center text-wrap transition-all px-2 relative">
              <i className="fa-sharp-duotone fa-solid fa-heart-circle-exclamation fa-light"></i>
              Estudios medicos
              <div className="absolute transition-all duration-500 bg-white h-px w-72 end-full group-hover:end-4"></div>
            </div>
          </div>
        </div>
      </div>
      <img
        src="img/logo.png"
        alt="Page LOGO"
        className="w-56 my-2 mx-auto block justify-self-end"
      />
    </div>
  );
};

export default Sidebar;
