import GuestLayout from "../components/GuestLayout";
import { useState } from "react";
import axios from "axios";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    gender: "male",
    role: "1",
    birthdate: "",
    telephone: "",
  });

  const inputErrorMessages = {
    username:
      "Nombre real completo, con mayusculas en el inicio. Ejemplo: Osvaldo Motrices",
    email: "Formato incorrecto, ejemplo: micorreo@gmail.com",
    password:
      "Debe contener mayúsculas, minúsculas, números y caracteres especiales. Longitud no menor a 8 letras",
    birthdate: "Debes ser mayor de 18 años",
    telephone: "Ingresa pais, codigo de area y numero de telefono",
  };
  const [response, setResponse] = useState(null);
  const [visualizeInput, setInputView] = useState(false);

  const handleValidity = (e) => {
    let el = e.target;
    const { name } = el;
    el.setCustomValidity(inputErrorMessages[name]);
  };

  const handleChange = (e) => {
    e.target.setCustomValidity("");
    const { name, value } = e.target;
    if (!e.target.reportValidity())
      e.target.setCustomValidity(inputErrorMessages[name]);
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post(
        process.env.REACT_APP_API_URL
  + "/registerauth",
        formData,
        { withCredentials: true }
      );
      console.log("Resultados JSON");
      console.log(result.data);
      var response = result.data;
      if (response.hasOwnProperty("redirect_route")) {
        console.log("REDIRECT ROUTE");
        window.location.href = response.redirect_route;
      } else {
        console.log("NO REDIRECT ROUTE");
      }
      if (response.hasOwnProperty("message")) {
        console.log("THERE IS A MESSAGE");
      }
      setResponse(result.data); // Guarda la respuesta de la API
    } catch (error) {
      console.error("Error al registrar", error);
      console.log("Resultados JSON");
      console.log(error.response?.data);
      var response = error.response?.data;
      if (response.hasOwnProperty("redirect_route")) {
        console.log("REDIRECT ROUTE");
        window.location.href = response.redirect_route;
      } else {
        console.log("NO REDIRECT ROUTE");
      }
      if (response.hasOwnProperty("message")) {
        console.log("THERE IS A MESSAGE");
      }
      setResponse(error.response?.data || "Error en la solicitud");
    }
  };

  return (
    <Card className={`max-w-96 my-4 rounded-sm animate-slideIn`}>
      <form onSubmit={handleSubmit} method="POST">
          <p className="text-4xl text-green-800 text-center py-12">Registrarse</p>
          <div className="flex flex-col gap-4 relative px-2">
            <label
              htmlFor="email"
              className="text-green-950 mb-2 select-none relative"
            >
              <input
                type="email"
                id="email"
                name="email"
                className="peer w-full p-2 outline-none border border-gray-300 focus:placeholder-shown:border-green-600 invalid:text-red-900 invalid:[&:not(:placeholder-shown)]:border-red-400"
                required
                placeholder=" "
                onChange={handleChange}
                onInvalid={handleValidity}
                value={formData.email}
              />
              <span
                className={
                  (formData.email ? "bottom-8" : "bottom-2") +
                  " peer-focus:bottom-8 peer-[&:not(:placeholder-shown):invalid]:text-red-500 absolute start-2 bg-white transition-all"
                }
              >
                Correo Electrónico
              </span>
            </label>
            <label
              htmlFor="username"
              className="text-green-950 mb-2 select-none relative"
            >
              <input
                type="text"
                id="username"
                name="username"
                className="peer placeholder:opacity-0 focus:placeholder:opacity-100 w-full p-2 outline-none border border-gray-300 focus:placeholder-shown:border-green-600 invalid:text-red-900 invalid:[&:not(:placeholder-shown)]:border-red-400"
                required
                placeholder="John Doe"
                onChange={handleChange}
                onInvalid={handleValidity}
                value={formData.username}
                pattern="(?!.*([A-ZÑÁÉÍÓÚÜ]{1}[a-zñáéíóúü\.\-']+){2,})([A-ZÑÁÉÍÓÚÜ]{1}[a-zñáéíóúü\.\-']+\s?){2,10}"
              />
              <span
                className={
                  (formData.username ? "bottom-8" : "bottom-2") +
                  " peer-focus:bottom-8 peer-[&:not(:placeholder-shown):invalid]:text-red-500 absolute start-2 bg-white transition-all"
                }
              >
                Nombre
              </span>
            </label>
            <label
              htmlFor="password"
              className="text-green-950 mb-2 select-none relative"
            >
              <input
                type={visualizeInput ? "text" : "password"}
                id="password"
                name="password"
                className="peer w-full p-2 outline-none border border-gray-300 focus:placeholder-shown:border-green-600 invalid:text-red-900 invalid:[&:not(:placeholder-shown)]:border-red-400"
                required
                onChange={handleChange}
                onInvalid={handleValidity}
                value={formData.password}
                placeholder=" "
                pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@\?#~_\-+&])[a-zA-Z0-9!@\?#~_\-+&]{8,}"
              />
              <span
                className={
                  (formData.password ? "bottom-8" : "bottom-2") +
                  " peer-focus:bottom-8 peer-[&:not(:placeholder-shown):invalid]:text-red-500 peer-checked:bottom-8 absolute start-2 bg-white transition-all"
                }
              >
                Contraseña
              </span>
              <button
                type="button"
                onClick={() => {
                  setInputView(!visualizeInput);
                }}
                className="absolute end-2 bottom-2 peer-[&:not(:placeholder-shown):invalid]:text-red-500"
              >
                <i
                  className={`fa-solid ${
                    !visualizeInput ? "fa-eye" : "fa-eye-slash"
                  }`}
                ></i>
              </button>
            </label>
            <label
              htmlFor="telephone"
              className="text-green-950 mb-2 select-none relative"
            >
              <input
                type="text"
                id="telephone"
                name="telephone"
                className="peer placeholder:opacity-0 focus:placeholder:opacity-100 w-full p-2 outline-none border border-gray-300 focus:placeholder-shown:border-green-600 invalid:text-red-900 invalid:[&:not(:placeholder-shown)]:border-red-400"
                required
                placeholder="XX XX XXXX"
                onChange={handleChange}
                pattern="(\d+\s)(\d+\s)(\d{4,})"
                maxLength={15}
                onInvalid={handleValidity}
                value={formData.telephone}
              />
              <span
                className={
                  (formData.telephone ? "bottom-8" : "bottom-2") +
                  " peer-focus:bottom-8 peer-[&:not(:placeholder-shown):invalid]:text-red-500 absolute start-2 bg-white transition-all"
                }
              >
                Telefono
              </span>
            </label>
            <label htmlFor="gender" className="flex justify-between">
              Género:
              <select
                id="gender"
                name="gender"
                onChange={handleChange}
                value={formData.gender}
              >
                <option value="male">Hombre</option>
                <option value="female">Mujer</option>
              </select>
            </label>
            <label htmlFor="birthdate" className="flex justify-between">
              Fecha de Nacimiento:
              <input
                type="date"
                id="birthdate"
                onChange={handleChange}
                onInvalid={handleValidity}
                value={formData["birthdate"]}
                name="birthdate"
                max={
                  new Date().getFullYear() -
                  18 +
                  "-" +
                  new Date().toLocaleString("default", { month: "2-digit" }) +
                  "-" +
                  new Date().toLocaleDateString("default", { day: "2-digit" })
                }
                className="ms-1"
                required
              />
            </label>
            <label htmlFor="type" className="flex justify-between">
              Registrarse como:
              <select
                id="type"
                name="role"
                onChange={handleChange}
                value={formData.role}
              >
                <option value="1">Paciente</option>
                <option value="2">Doctor</option>
              </select>
            </label>
            {response && (
              <div className="max-w-80 mx-auto bg-yellow-400 text-white font-medium text-center p-4">
                {response["message"]}
              </div>
            )}
            <input
              type="submit"
              value="Registrarse"
              id="submit"
              className="block w-full p-2 border border-gray-300 rounded-md cursor-pointer  hover:text-white hover:bg-green-800 transition-all duration-75"
            />
          </div>
          <Link
            to="/login"
            className="text-sm text-start text-green-700 underline mt-8"
          >
            <p className="mt-8">¿Ya tienes cuenta?¡Inicia sesión!</p>
          </Link>
      </form>
    </Card>
  );
};

export default Register;
