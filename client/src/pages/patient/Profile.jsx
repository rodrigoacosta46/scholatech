import { Link } from 'react-router-dom';
import { userHook } from '../../hooks/userHook';

const Profile = () => {
  /* 
    El usuario tiene que poder guardar la cuenta de instagram, vincular instagram a la cuenta de la app
  */
  const { userInfo, userConfig } = userHook();

  return (
    <>
      <div
        className={`max-h-60 bg-${userConfig.theme}-950 flex justify-center gap-2 p-6 opacity-0 animate-[slideIn_2s_ease-in-out_1_forwards]`}
      >
        <img
          src="img/Gaben.png"
          alt="Page LOGO"
          className="w-36 object-cover rounded-full"
        />
        <div className="flex flex-col opacity-0 animate-[fadeIn_4s_ease-in-out_1_forwards]">
          <div className="mx-auto text-4xl text-white text-wrap">
            {userInfo.name}
            <div className="h-px bg-white w-0"></div>
          </div>
          <p className="text-sm text-gray-500">{userInfo.role}</p>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-flow-col grid-cols-3 gap-4">
          <div className="col-span-2">
            <div className="relative p-5 rounded-3xl bg-slate-200 text-slate-400 font-thin shadow-[5px_5px]">
              <i className="fa-solid fa-gear absolute -inset-1 text-3xl size-fit"></i>
              <p className="underline underline-offset-8 decoration-1 decoration-gray-400/80 text-2xl">
                Configuración de cuenta
              </p>
              <form action="">
                <div className="flex flex-col mt-4 gap-4">
                  <p className="flex bg-slate-300 p-4 rounded-3xl">
                    Nombre:
                    <input
                      type="text"
                      name=""
                      id=""
                      placeholder="Hernandez Gutierrez Nunez"
                      className="text-center w-full bg-transparent border-b-2 border-gray-400/80 focus:border-gray-600 outline-none transition-all focus:text-slate-800"
                    />
                  </p>
                  <p className="flex bg-slate-300 p-4 rounded-3xl">
                    Correo:
                    <input
                      type="email"
                      name=""
                      id=""
                      placeholder="correo@gmail.com"
                      className="text-center w-full bg-transparent border-b-2 border-gray-400/80 focus:border-gray-600 outline-none transition-all focus:text-slate-800"
                    />
                  </p>
                  <p className="flex bg-slate-300 p-4 rounded-3xl">
                    Telefono:
                    <input
                      type="text"
                      name=""
                      id=""
                      placeholder="+54 11 9 3023-2123"
                      className="text-center w-full bg-transparent border-b-2 border-gray-400/80 focus:border-gray-600 outline-none transition-all focus:text-slate-800"
                    />
                  </p>
                  <p className="flex bg-slate-300 p-4 rounded-3xl">
                    Nacimiento:
                    <input
                      type="date"
                      name=""
                      id=""
                      placeholder="+54 11 9 3023-2123"
                      className="text-center w-full bg-transparent border-b-2 border-gray-400/80 focus:border-gray-600 outline-none transition-all focus:text-slate-800"
                    />
                  </p>
                  <p className="flex bg-slate-300 p-4 rounded-3xl">
                    Dirección:
                    <input
                      type="text"
                      name=""
                      id=""
                      placeholder="Av.Rivadavia 1093"
                      className="text-center w-full bg-transparent border-b-2 border-gray-400/80 focus:border-gray-600 outline-none transition-all focus:text-slate-800"
                    />
                  </p>
                  <p className="flex bg-slate-300 p-4 rounded-3xl">
                    Contraseña:
                    <input
                      type="text"
                      name=""
                      id=""
                      placeholder="pepeelgrande123"
                      className="text-center w-full bg-transparent border-b-2 border-gray-400/80 focus:border-gray-600 outline-none transition-all focus:text-slate-800"
                    />
                  </p>
                  <p className="text-center">
                    <input
                      type="submit"
                      value="Guardar cambios"
                      className={`p-4 text-white bg-${userConfig.theme}-800 shadow-[5px_5px] shadow-slate-400 rounded-3xl cursor-pointer active:shadow-slate-300`}
                    />
                    <i className="fa-solid fa-pen-to-square relative -inset-4 text-xl text-black font-bold"></i>
                  </p>
                </div>
              </form>
            </div>
          </div>
          <div>
            <div
              className={`relative p-5 rounded-3xl bg-slate-200 text-slate-400 font-thin shadow-[5px_5px] shadow-${userConfig.theme}-900`}
            >
              <i
                className={`fa-solid fa-comment absolute end-0 -top-1 text-3xl size-fit text-${userConfig.theme}-900`}
              ></i>
              <p
                className={`underline underline-offset-8 decoration-1 decoration-gray-400/80  text-${userConfig.theme}-900 text-2xl`}
              >
                Última entrada
              </p>
            </div>
            <div className="m-4">
              <Link to="/reminders">
                <div
                  className={`bg-slate-200 p-4 rounded-3xl text-lg cursor-pointer hover:shadow-[5px_5px] hover:shadow-${userConfig.theme}-950 hover:text-white hover:bg-${userConfig.theme}-800 transition-all`}
                >
                  <i className="fa-solid fa-circle-info size-fit"></i>
                  <span className="line-clamp-3">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Aut, unde quaerat laboriosam asperiores ea reiciendis dolore
                    repellat aliquid dolorem perspiciatis magnam ipsam nam
                    eligendi quae fugit pariatur similique. Et, voluptatum!
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
