
import { Link } from "react-router-dom";
import { UserInterface, userHook } from "../../hooks/userHook";
import { roles } from "../../config/roles";
import Modal from "../../components/Modal";
import Title from "../../components/Title";
import React, { useEffect, useState } from 'react';

const SaveUserName = ({ formData, theme, onSave }) => {
  const [username, setUserName] = useState(formData);
  const [isValid, setValidState] = useState(false);
  const reg = /^(?!.*([A-ZÑÁÉÍÓÚÜ]{1}[a-zñáéíóúü\.\-']+){2,})([A-ZÑÁÉÍÓÚÜ]{1}[a-zñáéíóúü\.\-']+\s?){2,10}$/;

  const inputFormat = (value) => {
    setValidState(false);
    if (reg.test(value) && value != formData && value.length < 50) {
      console.log("que");
      setValidState(true);
      setUserName(value);
    }
  };

  const saveChanges = () => {
    onSave("Username", username);
  };

  return (
    <>
      <Title
        txt={
          <>
            Cambiar nombre de usuario
            <i
              className={`fa-solid fa-user ms-4 float-end text text-${theme}-800`}
            ></i>
          </>
        }
        allowAnimations={true}
        scheme={theme}
        className="text-2xl"
      />
      <div className="flex flex-col p-8">
        <input
          type="text"
          onChange={(e) => {
            inputFormat(e.target.value);
          }}
          defaultValue={username}
          placeholder="Nombre de usuario"
          className="bg-gray-200 outline-none p-4 rounded-2xl"
        />
        <p className="italic text-sm mt-4 w-96 text-center">
          Importante: El nombre de usuario debe ser su nombre real y no más de
          50 caracteres.
          Ejemplo: <span className="font-bold">Nicolas Krulewietki</span>
        </p>
      </div>
      <button
        onClick={saveChanges}
        disabled={!isValid}
        className={`w-full p-4 transition-all ${
          isValid ? `bg-${theme}-900 text-white` : `bg-gray-200 text-slate-800`
        }`}
      >
        Guardar
      </button>
    </>
  );
};

const SaveUserMail = ({ formData, theme, onSave }) => {
  const [useremail, setUserEmail] = useState(formData);
  const [isValid, setValidState] = useState(true);
  const reg = /^\S+@\S+\.\S+$/;

  const inputFormat = (e) => {
    let input = e.target.value;

    if (!reg.test(input)) {
      return setValidState(false);
    }

    setValidState(true);
    setUserEmail(input);
  };

  const saveChanges = () => {
    onSave("Email", useremail);
  };

  return (
    <>
      <Title
        txt={
          <>
            Cambiar correo electrónico
            <i
              className={`fa-solid fa-at ms-4 float-end text-3xl text-${theme}-800`}
            ></i>
          </>
        }
        allowAnimations={true}
        scheme={theme}
        className="text-2xl"
      />
      <div className="flex flex-col p-8">
        <input
          type="text"
          defaultValue={useremail}
          onChange={inputFormat}
          placeholder="Correo electrónico"
          className="bg-gray-200 outline-none p-4 rounded-2xl "
        />
        {!isValid && (
          <p className={`text-red-700 text-sm italic`}>
            Formato incorrecto, seguir el ejemplo: ejemplo@gmail.com
          </p>
        )}
      </div>
      <button
        onClick={saveChanges}
        disabled={!isValid || formData == useremail}
        className={`w-full p-4 transition-all bg-gray-200 text-slate-800 ${
          isValid &&
          useremail != formData &&
          `hover:bg-${theme}-900 hover:text-white`
        }`}
      >
        Guardar
      </button>
    </>
  );
};

const SaveUserPassword = ({ theme, onSave }) => {
  const [userpass, setNewPass] = useState({
    current: null,
    new: "",
    conf: "",
  });
  const [isValid, setValidState] = useState({
    state: true,
    message: "",
  });

  const setNewPassword = (e) => {
    let { name, value } = e.target;
    setNewPass({
      ...userpass,
      [name]: value,
    });
  };

  const passwordFormat = () => {
    let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@\?#~_\-+&])[a-zA-Z0-9!@\?#~_\-+&]{8,}$/;
    return reg.test(userpass.new);
  };

  const checkInputs = () => {
    let st = true;
    let msg = "";

    //  XHR ACA
    const claveLlamadaDelServidor = "pedro";
    if (userpass.current != claveLlamadaDelServidor) {
      st = false;
      msg += "La contraseña actual es incorrecta.";
    }

    if (!passwordFormat()) {
      st = false;
      msg += "La contraseña nueva no cumple con el formato.";
    }

    if (userpass.new != userpass.conf) {
      st = false;
      msg += "Las contraseñas no coinciden.";
    }

    if (!st) {
      return setValidState({
        state: st,
        message: msg,
      });
    }

    onSave("Password", userpass.new);
  };

  return (
    <>
      <Title
        txt={
          <>
            Cambiar contraseña
            <i
              className={`fa-solid fa-unlock ms-4 float-end text-3xl text-${theme}-800`}
            ></i>
          </>
        }
        allowAnimations={true}
        scheme={theme}
        className="text-2xl"
      />
      <div className="flex flex-col p-8 gap-4">
        <input
          type="password"
          name="current"
          defaultValue={userpass.current || ''}
          onChange={setNewPassword}
          placeholder="Contraseña actual"
          className="bg-gray-200 p-4 outline-none rounded-2xl  focus:text-slate-800"
        />
        <input
          type="password"
          name="new"
          defaultValue={userpass.new || ''}
          onChange={setNewPassword}
          placeholder="Nueva contraseña"
          className="bg-gray-200 p-4 outline-none rounded-2xl  focus:text-slate-800"
        />
        <input
          type="password"
          name="conf"
          defaultValue={userpass.conf || ''}
          onChange={setNewPassword}
          placeholder="Confirmar nueva contraseña"
          className="bg-gray-200 p-4  rounded-2xl outline-none focus:text-slate-800"
        />
        {!isValid.state && (
          <p className="text-red-700 text-sm max-w-96">{isValid.message}</p>
        )}
        <div className="italic text-sm w-full flex flex-col items-center">
          Importante: La nueva contraseña debe...
          <ul className="list-disc">
            <li>Ser mayor a 8 caracteres</li>
            <li>Contener caracteres especiales</li>
            <li>Mayusculas y minusculas</li>
            <li>Numeros</li>
          </ul>
        </div>
      </div>
      <button
        onClick={checkInputs}
        className={`w-full p-4 transition-all bg-gray-200 text-slate-800 hover:bg-${theme}-900 hover:text-white`}
      >
        Guardar
      </button>
    </>
  );
};

const SaveUserBirthDate = ({ formData, theme, onSave }) => {
  const [birtdate, setBirthDate] = useState(formData);
  const minDate = new Date(
    new Date().getFullYear() - 18,
    new Date().getMonth(),
    new Date().getDate()
  ).getTime();

  const saveChanges = () => {
    onSave("Birthdate", birtdate);
  };

  return (
    <>
      <Title
        txt={
          <>
            Cambiar fecha de nacimiento
            <i
              className={`fa-solid fa-circle-info ms-4 float-end text-3xl text-${theme}-800`}
            ></i>
          </>
        }
        allowAnimations={true}
        scheme={theme}
        className="text-2xl"
      />
      <div className="flex flex-col p-8">
        <input
          type="date"
          onChange={(e) => {
            setBirthDate(e.target.value);
          }}
          defaultValue={birtdate}
          className="bg-gray-200 text-xl hover:text-slate-800"
        />
        <p className="italic text-sm">
          Importante: Tu edad debe superar los 18 años
        </p>
      </div>
      <button
        onClick={saveChanges}
        disabled={
          birtdate == formData ||
          (new Date(birtdate).getTime() > minDate && true)
        }
        className={`w-full p-4 transition-all ${
          birtdate != formData && new Date(birtdate).getTime() < minDate
            ? `bg-${theme}-900 text-white`
            : `bg-gray-200 text-slate-800`
        }`}
      >
        Guardar
      </button>
    </>
  );
};

const SaveUserDescription = ({ formData, theme, onSave }) => {
  const [userdesc, setUserDesc] = useState(formData);
  const [isValid, setValidState] = useState(true);
  const descLength = 1000;

  const setWordCounter = (e) => {
    let input = e.target.value;
    setValidState(false);
    if (input.length <= descLength && input.length > 50) {
      setUserDesc(input);
      setValidState(true);
      return;
    }
  };

  const saveChanges = () => {
    onSave("Description", userdesc);
  };

  return (
    <>
      <Title
        txt={
          <>
            Cambiar descripción profesional
            <i
              className={`fa-solid fa-circle-info ms-4 float-end text-3xl text-${theme}-800`}
            ></i>
          </>
        }
        allowAnimations={true}
        scheme={theme}
        className="text-2xl"
      />
      <div className="flex flex-col p-8">
        <textarea
          onChange={setWordCounter}
          defaultValue={userdesc}
          placeholder="Descripción"
          rows={5}
          className="bg-gray-200 outline-none p-4 rounded-2xl"
        />
        <p className="text-sm">
          {!isValid && (
            <span className="float-start italic text-red-700 mx-2 text-center">
              La descripción debe estar entre 50 a 1000 caracteres
            </span>
          )}
          <span className="float-end">
            {userdesc.length}|{descLength}
          </span>
        </p>
      </div>
      <button
        onClick={saveChanges}
        disabled={!isValid || formData == userdesc}
        className={`w-full p-4 transition-all ${
          isValid && formData != userdesc
            ? `bg-${theme}-900 text-white`
            : `bg-gray-200 text-slate-800`
        }`}
      >
        Guardar
      </button>
    </>
  );
};

const SaveUserAddress = ({ formData, theme, onSave }) => {
  const [userdir, setUserDir] = useState(formData);
  const [isValid, setValidState] = useState(false);
  const reg = /^.{1,100}$/;

  const inputFormat = (value) => {
    setValidState(false);
    if (reg.test(value) && formData != value) {
      setUserDir(value);
      setValidState(true);
    }
  };

  const saveChanges = () => {
    onSave("Address", userdir);
  };

  return (
    <>
      <Title
        txt={
          <>
            Cambiar dirección de consultorio
            <i
              className={`fa-solid fa-location-dot ms-4 float-end text text-${theme}-800`}
            ></i>
          </>
        }
        allowAnimations={true}
        scheme={theme}
        className="text-2xl"
      />
      <div className="flex flex-col p-8">
        <input
          type="text"
          onChange={(e) => {
            inputFormat(e.target.value);
          }}
          defaultValue={userdir}
          placeholder="Dirección de consultorio"
          className="bg-gray-200 outline-none p-4 rounded-2xl"
        />
      </div>
      <button
        onClick={saveChanges}
        disabled={!isValid}
        className={`w-full p-4 transition-all ${
          isValid ? `bg-${theme}-900 text-white` : `bg-gray-200 text-slate-800`
        }`}
      >
        Guardar
      </button>
    </>
  );
};

const SaveUserProfession = ({ formData, theme, onSave }) => {
  const [userprof, setUserProf] = useState(formData);
  const [isValid, setValidState] = useState(false);
  const reg = /^.{1,50}$/;

  const inputFormat = (value) => {
    setValidState(false);
    if (reg.test(value) && formData != value) {
      setUserProf(value);
      setValidState(true);
    }
  };

  const saveChanges = () => {
    onSave("Speciality", userprof);
  };

  return (
    <>
      <Title
        txt={
          <>
            Cambiar dirección de consultorio
            <i
              className={`fa-solid fa-location-dot ms-4 float-end text text-${theme}-800`}
            ></i>
          </>
        }
        allowAnimations={true}
        scheme={theme}
        className="text-2xl"
      />
      <div className="flex flex-col p-8">
        <input
          type="text"
          onChange={(e) => {
            inputFormat(e.target.value);
          }}
          defaultValue={userprof}
          placeholder="Especialista en..."
          className="bg-gray-200 outline-none p-4 rounded-2xl"
        />
      </div>
      <button
        onClick={saveChanges}
        disabled={!isValid}
        className={`w-full p-4 transition-all ${
          isValid ? `bg-${theme}-900 text-white` : `bg-gray-200 text-slate-800`
        }`}
      >
        Guardar
      </button>
    </>
  );
}

const Profile = () => {  /* 
    El usuario tiene que poder guardar la cuenta de instagram, vincular instagram a la cuenta de la app
  */
  const { userInfo, userConfig } = userHook();

  const [formStorage, setFormStorage] = useState<UserInterface>({
    ID: userInfo["ID"],
    Username: userInfo["Username"],
    Email: userInfo["Email"],
    Gender: userInfo["Gender"],
    Birthdate: userInfo["Birthdate"],
    Password: userInfo["Password"],
    Picture: userInfo["Picture"],
    Telephone: userInfo["Telephone"],
    Address: userInfo["Address"] || "",
    Description: userInfo["Description"] /*|| "" */,     //Solo si el usuario es Doctor
    Speciality: userInfo["Speciality"] || "",
    CreatedAt: userInfo["CreatedAt"],
    UpdatedAt: userInfo["UpdatedAt"],
    DeletedAt: userInfo["DeletedAt"],
    Perfil: {
      ...userInfo["Perfil"]
    }
  });
  
  const [isGenderDisabled, setDisableState] = useState(true);
  const [inputModal, setModal] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const [formChanged, setFormChange] = useState(false);

  const setModalState = (inputField) => {
    setCurrentField(inputField);
    setModal(true);
  };

  const handleFieldSave = (key, val) => {
    setModal(false);
    setFormStorage({
      ...formStorage,
      [key]: val,
    });
    setFormChange(true);
  };

  const clearFields = () => {
    setFormStorage({...userInfo});
    setFormChange(false);
  };

  useEffect(() => {
    console.log(formStorage);
  }, [formStorage]);

  return (
    <>
      <Modal
        state={inputModal}
        setter={() => {
          setModal(false);
        }}
        allowAnimations={false}
        scheme={userConfig.theme}
      >
        <div className="col-span-2">{currentField != null && currentField}</div>
      </Modal>

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
            {userInfo["Username"]}
            <div className="h-px bg-white w-0"></div>
          </div>
          <p className="text-sm text-gray-500">{userInfo["Perfil"].Name}</p>
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
              <div onClick={clearFields} className="group w-fit mt-3 float-end transition-all cursor-pointer hover:text-red-700 hover:scale-105">
                <i className="fa-regular fa-trash-can text-lg"></i>
                <span className="underline hidden text-sm group-hover:inline">Descartar cambios</span>
              </div>
              <form action="">
                <div className="w-full grid grid-cols-3 gap-4 items-center text-slate-600 pt-6 px-2">
                  Nombre:
                  <div
                    className="col-span-2 relative"
                    onClick={() => {
                      setModalState(
                        <SaveUserName
                          formData={formStorage["Username"]}
                          theme={userConfig.theme}
                          onSave={handleFieldSave}
                        />
                      );
                    }}
                  >
                    <i className="fa-regular fa-pen-to-square hover:text-slate-800 absolute end-px"></i>
                    <input
                      type="text"
                      name="username"
                      value={formStorage["Username"]}
                      disabled={true}
                      className="bg-gray-300 px-4 py-2 w-full rounded-2xl text-slate-700 text-ellipsis pointer-events-none"
                    />
                  </div>
                  Correo:
                  <div
                    className="col-span-2 relative"
                    onClick={() => {
                      setModalState(
                        <SaveUserMail
                          formData={formStorage["Email"]}
                          theme={userConfig.theme}
                          onSave={handleFieldSave}
                        />
                      );
                    }}
                  >
                    <i className="fa-regular fa-pen-to-square hover:text-slate-800 absolute end-px"></i>
                    <input
                      type="email"
                      name="email"
                      value={formStorage["Email"]}
                      disabled={true}
                      className="bg-gray-300 px-4 py-2 w-full rounded-2xl text-slate-700 text-ellipsis pointer-events-none"
                    />
                  </div>
                  Contraseña:
                  <div
                    className="col-span-2 relative place-self-end"
                    onClick={() => {
                      setModalState(
                        <SaveUserPassword
                          theme={userConfig.theme}
                          onSave={handleFieldSave}
                        />
                      );
                    }}
                  >
                    <i className="fa-regular fa-pen-to-square hover:text-slate-800 absolute end-px"></i>
                    <input
                      type="password"
                      name="password"
                      value={formStorage['Password']}
                      disabled={true}
                      className="bg-gray-300 px-4 py-2 w-full rounded-2xl text-slate-700 text-ellipsis pointer-events-none"
                    />
                  </div>
                  Género:
                  <div className="col-span-2 relative place-self-end">
                    <i
                      onClick={() => setDisableState(!isGenderDisabled)}
                      className="fa-regular z-10 fa-pen-to-square cursor-pointer hover:text-slate-800 absolute end-1 top-2 bg-gray-300"
                    ></i>
                    <select
                      name="gender"
                      disabled={isGenderDisabled}
                      onChange={(e) => {
                        handleFieldSave("Gender", e.target.value);
                      }}
                      defaultValue={formStorage["Gender"]}
                      className="transition-all outline-none bg-gray-300 px-4 py-2 w-full rounded-2xl text-slate-700"
                    >
                      <option value="male">Masculino</option>
                      <option value="female">Femenino</option>
                    </select>
                  </div>
                  Fecha de nacimiento:
                  <div
                    className="col-span-2 relative place-self-end"
                    onClick={() => {
                      setModalState(
                        <SaveUserBirthDate
                          formData={formStorage['Birthdate']}
                          theme={userConfig.theme}
                          onSave={handleFieldSave}
                        />
                      );
                    }}
                  >
                    <i className="fa-regular fa-pen-to-square hover:text-slate-800 absolute end-px"></i>
                    <input
                      type="date"
                      name="birthdate"
                      value={formStorage['Birthdate']}
                      disabled={true}
                      className="bg-gray-300 px-4 py-2 w-full rounded-2xl text-slate-700 text-ellipsis pointer-events-none"
                    />
                  </div>
                  Foto de perfil:
                  <div className="col-span-2 relative place-self-end">
                    <label htmlFor="profileFile">
                      <i className="fa-regular z-10 fa-pen-to-square hover:text-slate-800 absolute end-1  bg-gray-300"></i>
                    </label>
                    <div className="flex underline bg-gray-300 px-4 py-2 rounded-2xl text-slate-700">
                      <img src="img/Gaben.png" alt="" className="w-4 pe-1" />
                      Pepe el manati andante.png
                    </div>
                    <input
                      type="file"
                      name="picture"
                      id="profileFile"
                      className="hidden"
                    />
                  </div>
                  {userInfo.Perfil.Name == roles["doctor"] && (
                    <>
                      Descripción:
                      <div
                        className="col-span-2 relative"
                        onClick={() => {
                          setModalState(
                            <SaveUserDescription
                              //formData={formStorage.descripcion}
                              formData={formStorage['Description']}
                              theme={userConfig.theme}
                              onSave={handleFieldSave}
                            />
                          );
                        }}
                      >
                        <i className="fa-regular fa-pen-to-square hover:text-slate-800 absolute end-px"></i>
                        <input
                          type="text"
                          name="description"
                          value={formStorage['Description']}
                          //value={formStorage.descripcion}
                          disabled={true}
                          className="bg-gray-300 px-4 py-2 w-full rounded-2xl text-slate-700 text-ellipsis pointer-events-none"
                        />
                      </div>
                      Dirección:
                      <div
                        className="col-span-2 relative"
                        onClick={() => {
                          setModalState(
                            <SaveUserAddress
                              formData={formStorage['Address']}
                              theme={userConfig.theme}
                              onSave={handleFieldSave}
                            />
                          );
                        }}
                      >
                        <i className="fa-regular fa-pen-to-square hover:text-slate-800 absolute end-px"></i>
                        <input
                          type="text"
                          name="address"
                          value={formStorage['Address']}
                          disabled={true}
                          className="bg-gray-300 px-4 py-2 w-full rounded-2xl outline-none text-slate-700 text-ellipsis pointer-events-none"
                        />
                      </div>
                      Especialidad:
                      <div
                        className="col-span-2 relative place-self-end"
                        onClick={() => {
                          setModalState(
                            <SaveUserProfession
                              formData={formStorage['Speciality']}
                              theme={userConfig.theme}
                              onSave={handleFieldSave}
                            />
                          );
                        }}
                      >
                        <i className="fa-regular fa-pen-to-square hover:text-slate-800 absolute end-px"></i>
                        <input
                          type="text"
                          name="department"
                          value={formStorage['Speciality']}
                          disabled={true}
                          className="bg-gray-300 px-4 py-2 rounded-2xl outline-none text-slate-700 text-ellipsis pointer-events-none"
                        />
                      </div>
                    </>
                  )}
                  <div className="col-span-3">
                    <input
                      type="submit"
                      value="Guardar cambios"
                      disabled={!formChanged}
                      className={`transition-all duration-200 rounded-3xl p-4 mx-auto block relative ${
                        formChanged
                          ? `bg-${userConfig.theme}-700 cursor-pointer text-white shadow-[5px_5px] shadow-gray-400 -inset-1 active:inset-0 active:shadow-gray-200`
                          : `bg-gray-300/35 text-gray-400/80 cursor-not-allowed `
                      }`}
                    />
                  </div>
                </div>
              </form>
              <p className="flex flex-col gap-1 text-sm mt-7">
                Registrado el: {userInfo["CreatedAt"]} 
                <p className="italic">Última actualización el: {userInfo["UpdatedAt"]}</p>
              </p>
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
                Última Notificación
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
