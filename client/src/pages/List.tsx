import Title from "../components/Title";
import Card from "../components/Card";
import VerticalScroller from "../components/VerticalScroller";
import { userHook } from "../hooks/userHook";
import React, { useState } from "react";
import { config, roles } from "../config/roles";

interface RequestFilters {
  Name: string;
  Email: string;
  Birthdate: string;
  Gender: string;
  Role: string;
}

const List = () => {
  const { userConfig } = userHook();
  const [selected, setSelectedUsers] = useState<any>([]);
  const [filters, setFilters] =  useState<RequestFilters>({
    Name: '',
    Email: '',
    Birthdate: '',
    Gender: '',
    Role: '',
  });
  const [sendPost, setSendPost] = useState<RequestFilters | null>();

  const handleFieldChange = (e) => {
    const {name, value} = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      Name: '',
      Email: '',
      Birthdate: '',
      Gender: '',
      Role: '',
    });
  };

  const submitFilters = (e) => {
    e.preventDefault();
    let flag = Object.entries(filters).some((val:any) => {
      return val[1] != sendPost?.[val[0]];
    })
    if (flag){
      setSendPost(prev => ({...prev, ...filters}));
      console.log("fecheeéxd");
    } 
  }
  
  const checkChanged = (e) => {
    if (!e.target.checked) {
      let arr = [...selected];
      let index = selected.indexOf(e.target.value);
      arr.splice(index, 1);
      setSelectedUsers(arr);
      return;
    }
    setSelectedUsers([...selected, e.target.value]);
  };

  const unSelectUsers = () => {
    if (selected.length > 0) {
      setSelectedUsers([]);
    }
  };

  const userModel = (registro, i) => {
    let theme =
      config.theme[
        Object.keys(roles).find((k) => roles[k] === registro.Perfil.Name)
      ];
    return (
      <label key={"k-" + i}>
        <input
          type="checkbox"
          className="hidden peer"
          checked={selected.includes(String(registro.ID))}
          onChange={(e) => checkChanged(e)}
          value={registro.ID}
        />
        <Card
          scheme={userConfig.theme}
          className="flag relative cursor-pointer animate-fadeIn transition-all duration-500 peer-checked:[&>i]:opacity-100 peer-checked:shadow-slate-300 peer-checked:-translate-y-4 peer-checked:shadow-lg"
        >
          <i className="fa-solid fa-check absolute -top-4 -end-2 p-3 transition-all duration-500 rounded-full bg-green-600 text-white opacity-0"></i>
          <img
            src={process.env.REACT_APP_API_URL
  + `/getImage/profiles/${registro.ID}/${registro.ID}`}
          />
          <Title
              txt={
                <div className="flex justify-between gap-1">
                  {registro.Username}
                  <span className={`flex-shrink float-end font-bold text-${theme}-400`}>
                    {registro.Perfil.Name}
                  </span>
                </div>
              }
              className="mt-2"
              scheme={theme}
            />
          <input type="checkbox" id={"nextCheck-"+i} className="hidden peer/next"/>
          <div className="p-2 overflow-hidden peer-checked/next:[&>.flag-1]:size-0 peer-checked/next:[&>.flag-1]:-translate-x-4 peer-checked/next:[&>.flag-1]:opacity-0 peer-checked/next:[&>.flag-2]:size-full peer-checked/next:[&>.flag-2]:translate-x-0 peer-checked/next:[&>.flag-2]:opacity-100">
            <div className="flag-1 flex flex-col gap-2 transition-[opacity,transform] duration-500 text-slate-600 size-full">
              <p>
                Correo:{" "}
                <span
                  className="underline underline-offset-4 float-end line-clamp-2"
                  title={registro.Email}
                >
                  {registro.Email}
                </span>
              </p>
              <p>
                {" "}
                Género:{" "}
                <i
                  className={`fa-solid font-bold text-lg float-end ${
                    registro.Gender == "male"
                      ? "fa-mars text-blue-500"
                      : "fa-venus text-red-400"
                  }`}
                />
              </p>
              <p>
                Teléfono:{" "}
                <span
                  className="underline underline-offset-4 float-end line-clamp-2"
                  title={registro.Telephone}
                >
                  {registro.Telephone || "No especificado"}
                </span>
              </p>
              <p>
                Especialidad:{" "}
                <span
                  className="underline underline-offset-4 float-end line-clamp-2"
                  title={registro.Speciality}
                >
                  {registro.Speciality || "No especificado"}
                </span>
              </p>
            </div>
            <div className="flag-2 flex flex-col gap-2 transition-[opacity,transform] duration-500 text-slate-600 translate-x-4 opacity-0 size-0">
              <p>
                Descripción:{" "}
                <span
                  className="underline underline-offset-4 float-end"
                  title={registro.Description}
                >
                  {registro.Description || "No especificado"}
                </span>
              </p>
              <p>
                Dirección:{" "}
                <span
                  className="underline underline-offset-4 float-end"
                  title={registro.Address}
                >
                  {registro.Address || "No especificado"}
                </span>
              </p>
              <p>
                Nacimiento:{" "}
                <span
                  className="underline underline-offset-4 float-end"
                  title={registro.Birthdate}
                >
                  {registro.Birthdate.split("T")[0]}
                </span>
              </p>
            </div>
          </div>
        <label htmlFor={"nextCheck-"+i} className="absolute bottom-4 end-4 float-end p-2 peer-checked/next:[&>.fa-folder-open]:visible peer-checked/next:[&>.fa-folder-closed]:hidden">
          <i className="fa-solid fa-folder-open absolute  invisible size-0 text-slate-300 hover:text-slate-400" />
          <i className="fa-solid fa-folder-closed absolute size-4 text-slate-300 hover:text-slate-400" />
        </label>
        </Card>
      </label>
    );
  };

  return (
    <>
      <Title
        txt="Listado de usuarios"
        allowAnimations={true}
        scheme={userConfig.theme}
      />

      <div className="space-y-4 mx-14">
        <div className="relative m-16">
          <input type="checkbox" id="check" className="hidden peer" />
          <label
            htmlFor="check"
            className="cursor-pointer select-none relative z-20 peer-checked:[&>div]:bg-red-700 peer-checked:[&>div]:text-white peer-checked:[&>div]:shadow-slate-400"
          >
            <div className="transition-all duration-1000 bg-white rounded-3xl p-4 shadow-[1px_2px] shadow-red-700">
              <i className="fa-solid fa-search me-2" />
              Opciones de busqueda
            </div>
          </label>
          <form onChange={handleFieldChange} onSubmit={submitFilters} method="POST" className="transition-all duration-1000 delay-200 overflow-hidden absolute top-5 z-10 flex flex-wrap gap-8 justify-center align-center rounded-b-xl opacity-0 invisible max-h-0 p-0 bg-red-700 peer-checked:max-h-[800px] peer-checked:visible peer-checked:opacity-100 peer-checked:p-14 peer-checked:pb-2">
            <label>
              <p className="text-slate-400 text-start text-sm">- Nombre -</p>
              <input
                type="text"
                name="Name"
                placeholder="Nombre de usuario"
                value={filters.Name}
                className="w-48 h-10 transition-all duration-500 outline-none rounded-2xl p-2 placeholder:underline placeholder:underline-offset-4 shadow-[3px_3px] shadow-slate-200 focus:shadow-slate-400"
              />
            </label>
            <label>
              <p className="text-slate-400 text-start text-sm">- Correo -</p>
              <input
                type="email"
                name="Email"
                placeholder="Correo electrónico"
                value={filters.Email}
                className="w-48 h-10 transition-all duration-500 outline-none rounded-2xl p-2 placeholder:underline placeholder:underline-offset-4 shadow-[3px_3px] shadow-slate-200 focus:shadow-slate-400"
              />
            </label>
            <label>
              <p className="text-slate-400 text-start text-sm">
                - Nacimiento -
              </p>
              <input
                type="date"
                name="Birthdate"
                value={filters.Birthdate}
                className="w-48 h-10 transition-all duration-500 outline-none rounded-2xl p-2 placeholder:underline placeholder:underline-offset-4 shadow-[3px_3px] shadow-slate-200 focus:shadow-slate-400"
              />
            </label>
            <label>
              <p className="text-slate-400 text-start text-sm">- Género -</p>
              <select
                name="Gender"
                value={filters.Gender}
                className="w-48 h-10 transition-all duration-500 p-2 rounded-2xl outline-none shadow-[3px_3px] shadow-slate-300 focus:shadow-slate-400"
              >
                <option value="male">Hombre</option>
                <option value="female">Mujer</option>
              </select>
            </label>
            <label>
              <p className="text-slate-400 text-start text-sm">- Rol -</p>
              <select
                name="Role"
                value={filters.Role}
                className="w-48 h-10 transition-all duration-500 p-2 rounded-2xl outline-none shadow-[3px_3px] shadow-slate-300 focus:shadow-slate-400"
              >
                <option value="1">Paciente</option>
                <option value="2">Doctor</option>
              </select>
            </label>
            <div className="w-full flex justify-end gap-2 mt-4">
              <button
                onClick={clearFilters}
                type="button"
                className="transition-all group bg-white/15 px-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-white"
              >
                <i className="fa-solid fa-trash-can transition-all duration-500 text-lg group-hover:me-px group-hover:text-base" />
                <span className="transition-all duration-500 text-[0px] group-hover:text-sm">
                  Vaciar campos
                </span>
              </button>
              <input
                type="submit"
                value="Aplicar filtros"
                className="transition-all delay-150 p-3 cursor-pointer relative bg-red-600 text-white rounded-2xl inset-0 hover:-inset-1 hover:bg-red-800 hover:shadow-[3px_3px] hover:shadow-red-800"
              />
            </div>
          </form>
        </div>
      </div>
      <VerticalScroller
        url={String(process.env.REACT_APP_API_URL
  + "/getUsers")}
        params={sendPost}
        className="grid grid-cols-[repeat(auto-fit,250px)] gap-4 place-content-center place-items-center m-4"
        renderModel={userModel}
        empty="No se encontraron registros..."
      />

      <label className="w-40 fixed bottom-4 end-8 cursor-pointer group text-white bg-red-900 ms-auto py-2 rounded-xl">
        <input type="checkbox" className="peer hidden" />
        <ul className="text-center divide-y divide-solid divide-slate-300 text-sm transition-all duration-500 max-h-0 invisible opacity-0 opalist-none peer-checked:max-h-72 peer-checked:visible peer-checked:opacity-100 peer-checked:my-2">
          <li className="bg-red-500 p-2 hover:bg-red-600">
            <i className="fa-solid fa-user-slash me-1"></i>
            Banear selección
          </li>
          <li className="bg-red-500 p-2 hover:bg-red-600">
            <i className="fa-solid fa-clipboard-check me-1"></i>
            Confirmar doctor
          </li>
          <li
            onClick={unSelectUsers}
            className="bg-red-500 p-2 hover:bg-red-600"
          >
            <i className="fa-solid fa-minus me-1"></i>
            Deseleccionar
          </li>
        </ul>
        <div className="flex gap-1 justify-center items-center group-hover:[&>span]:text-sm peer-checked:[&>span]:text-sm">
          <i className="fa-solid fa-list-ul"></i>
          <span className="transition-all delay-150 text-[0px] underline underline-offset-4 select-none">
            Acciones
          </span>
        </div>
      </label>
    </>
  );
};

export default List;
