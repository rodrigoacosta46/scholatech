import Title from "../components/Title";
import { userHook } from "../hooks/userHook";
import React, { useEffect } from "react";

const List = () => {
  const { userConfig } = userHook();

  return (
    <>
      <Title
        txt="Listado de usuarios"
        allowAnimations={true}
        scheme={userConfig.theme}
      />

      <div className="space-y-4 mx-14">
          <div className="m-16">
            <input type="checkbox" id="check" className="hidden peer" />
            <label htmlFor="check" className="cursor-pointer select-none relative z-10 peer-checked:[&>div]:bg-red-700 peer-checked:[&>div]:text-white peer-checked:[&>div]:shadow-slate-400">
                <div className="transition-all duration-1000 bg-white rounded-3xl p-4 shadow-[1px_2px] shadow-red-700">
                    <i className="fa-solid fa-search me-2" />
                    Opciones de busqueda
                </div>
            </label>
            <form className="transition-all duration-1000 delay-200 overflow-hidden relative -top-5 flex flex-wrap gap-8 justify-center align-center rounded-b-xl opacity-0 invisible max-h-0 p-0 bg-red-700 peer-checked:max-h-[500px] peer-checked:visible peer-checked:opacity-100 peer-checked:p-14 peer-checked:pb-2">
                <label>
                    <p className="text-slate-400 text-start text-sm">- Nombre -</p>
                    <input type="text" name="username" placeholder="Nombre de usuario" className="w-48 h-10 transition-all duration-500 outline-none rounded-2xl p-2 placeholder:underline placeholder:underline-offset-4 shadow-[3px_3px] shadow-slate-200 focus:shadow-slate-400"/>
                </label>
                <label>
                    <p className="text-slate-400 text-start text-sm">- Correo -</p>
                    <input type="email" name="email" placeholder="Correo electrónico" className="w-48 h-10 transition-all duration-500 outline-none rounded-2xl p-2 placeholder:underline placeholder:underline-offset-4 shadow-[3px_3px] shadow-slate-200 focus:shadow-slate-400"/>
                </label>
                <label>
                    <p className="text-slate-400 text-start text-sm">- Nacimiento -</p>
                    <input type="date" name="birthdate" className="w-48 h-10 transition-all duration-500 outline-none rounded-2xl p-2 placeholder:underline placeholder:underline-offset-4 shadow-[3px_3px] shadow-slate-200 focus:shadow-slate-400"/>
                </label>
                <label>
                    <p className="text-slate-400 text-start text-sm">- Género -</p>
                    <select name="gender" defaultValue="male" className="w-48 h-10 transition-all duration-500 p-2 rounded-2xl outline-none shadow-[3px_3px] shadow-slate-300 focus:shadow-slate-400">
                        <option value="male">Hombre</option>
                        <option value="female">Mujer</option>
                    </select>
                </label>
                <label>
                    <p className="text-slate-400 text-start text-sm">- Rol -</p>
                    <select name="role" defaultValue="1" className="w-48 h-10 transition-all duration-500 p-2 rounded-2xl outline-none shadow-[3px_3px] shadow-slate-300 focus:shadow-slate-400">
                        <option value="1">Paciente</option>
                        <option value="2">Doctor</option>
                    </select>
                </label>
                <div className="w-full flex justify-end gap-2 mt-4">
                    <span className="text-slate-400 text-sm me-auto mt-auto">- 100 Resultados -</span>
                    <button type="button" className="transition-all group bg-white/15 px-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-white">
                        <i className="fa-solid fa-trash-can transition-all duration-500 text-lg group-hover:me-px group-hover:text-base"/>
                        <span className="transition-all duration-500 text-[0px] group-hover:text-sm">Vaciar campos</span>
                    </button>
                    <input type="submit" value="Aplicar filtros" className="transition-all delay-150 p-3 cursor-pointer relative bg-red-600 text-white rounded-2xl inset-0 hover:-inset-1 hover:bg-red-800 hover:shadow-[3px_3px] hover:shadow-red-800"/>
                </div>
            </form>
          </div>
      </div>
      <label className="fixed bottom-4 end-8 cursor-pointer group text-white bg-red-900 ms-auto w-fit py-2 rounded-xl">
        <input type="checkbox" className="peer hidden"/>
        <ul className="text-center divide-y divide-solid divide-slate-300 text-sm transition-all duration-500 max-h-0 invisible opacity-0 opalist-none peer-checked:max-h-72 peer-checked:visible peer-checked:opacity-100 peer-checked:my-2">
            <li className="bg-red-500 p-2 hover:bg-red-600">
                <button>
                    <i className="fa-solid fa-user-slash me-1"></i>
                    Banear selección
                </button>
            </li>
            <li className="bg-red-500 p-2 hover:bg-red-600">
                <button>
                    <i className="fa-solid fa-clipboard-check me-1"></i>
                    Confirmar doctor
                </button>
            </li>
        </ul>
        <div className="flex gap-1 justify-center items-center group-hover:[&>span]:text-sm peer-checked:[&>span]:text-sm">
            <i className="fa-solid fa-list-ul"></i>
            <span className="transition-all delay-150 text-[0px] underline underline-offset-4 select-none">Acciones</span>
        </div>
      </label>
    </>
  );
};

export default List;
