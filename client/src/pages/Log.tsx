import { useState } from 'react';
import axios from 'axios';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
 
const Log = () => {
  const [visualizeInput, setInputView] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post(
        process.env.REACT_APP_API_URL
  + '/loginauth', 
        formData,
        { withCredentials: true }
      );
      console.log("Resultados JSON")
      console.log(result.data)
      var response = result.data;
      if ((response).hasOwnProperty("redirect_route")) {
        console.log("REDIRECT ROUTE")
        window.location.href = response.redirect_route;
      }
      else {
        console.log("NO REDIRECT ROUTE")
      }
      if ((response).hasOwnProperty("message")) {
        console.log("THERE IS A MESSAGE")
      }
      setResponse(response.message); // Guarda la respuesta de la API

    } catch (error) {
      console.error('Error al autenticar', error);
      console.log("Resultados JSON")
      console.log(error.response?.data)
      var response = error.response?.data;

      if ((response).hasOwnProperty("redirect_route")) {
        console.log("REDIRECT ROUTE")
        window.location.href = response.redirect_route;
      }
      else {
        console.log("NO REDIRECT ROUTE")
      }
      if ((response).hasOwnProperty("message")) {
        console.log("THERE IS A MESSAGE")
      }
      setResponse(error.response?.data || 'Error en la solicitud');
    }
  };        
   
  return (
      <Card className={`max-w-96 p-4 my-4 rounded-sm animate-slideIn transition-all ${response ? 'shadow-yellow-400' : ''}`}>
        <form onSubmit={handleSubmit} method="POST">
            <p className="text-4xl text-green-800 text-center whitespace-nowrap py-12">Inicio de sesión</p>
            <div className="flex flex-col gap-2 relative">
              <label htmlFor="username" className="text-green-950 mb-2 select-none">
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="peer w-full p-2 border border-gray-300 focus:outline focus:outline-1 focus:outline-green-600"
                  onChange={handleChange}
                  value={formData.username}
                />
                <span className={(formData.username ? "bottom-14" : "bottom-[2.1rem]") + " peer-focus:bottom-14 relative start-4 bg-white transition-all"}>
                  Nombre
                </span>
              </label>
              <label htmlFor="password" className="text-green-950 mb-2 select-none relative">
                <input
                  type={visualizeInput ? "text" : "password"}
                  name="password"
                  id="password"
                  className="peer w-full p-2 border border-gray-300 focus:outline focus:outline-1 focus:outline-green-600"
                  onChange={handleChange}
                  value={formData.password}
                  autoComplete='new-password'
                />
                <span className={(formData.password ? "bottom-14" : "bottom-[2.1rem]") + " peer-focus:bottom-14 relative start-4 bg-white transition-all"}>
                  Contraseña
                </span>
                <button type="button" onClick={()=>{ setInputView(!visualizeInput); }} className="absolute end-2 bottom-8 peer-[&:not(:placeholder-shown):invalid]:text-red-500">
                  <i className={`fa-solid ${!visualizeInput ? "fa-eye" : "fa-eye-slash"}`}></i>
                </button>
              </label>
              <label htmlFor="remind" className="flex gap-[2px]">
                <input
                  type="checkbox"
                  name="remind"
                  id="remind"
                  className="accent-green-950"
                />
                Recordar
              </label>
              <input
                type="submit"
                value="Iniciar"
                id="submit"
                className="block w-full p-2 border border-gray-300 rounded-md cursor-pointer hover:text-white hover:bg-green-800 transition-all duration-75"
              />
            </div>
            {response && <p className='max-w-80 mx-auto bg-yellow-400 text-white text-center animate-fadeIn p-4 mt-8'>{response["message"] || response}</p>}
            <Link to="/register" className='text-sm text-start text-green-700 underline mt-8'>
              <p className="mt-8">¿No tienes cuenta?¡Registrate!</p>
            </Link>
        </form>
      </Card>
  );
};

export default Log;
