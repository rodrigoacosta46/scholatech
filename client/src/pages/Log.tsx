import { useState } from 'react';
import axios from 'axios';
import React, { useEffect } from 'react';


const Log = () => {
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
        'http://localhost:8000/loginauth', 
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
      <form onSubmit={handleSubmit} method="POST">
        <div className="w-96 bg-white p-8 border-b-2 border-e-2 border-green-800 shadow-lg rounded-sm">
          <p className="text-4xl text-green-800 text-center py-12">Login</p>
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
                Username
              </span>
            </label>
            <label htmlFor="password" className="text-green-950 mb-2 select-none">
              <input
                type="text"
                name="password"
                id="password"
                className="peer w-full p-2 border border-gray-300 focus:outline focus:outline-1 focus:outline-green-600"
                onChange={handleChange}
                value={formData.password}
              />
              <span className={(formData.password ? "bottom-14" : "bottom-[2.1rem]") + " peer-focus:bottom-14 relative start-4 bg-white transition-all"}>
                Password
              </span>
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
              id="submit"
              className="block w-full p-2 border border-gray-300 rounded-md cursor-pointer hover:text-white hover:bg-green-800 transition-all duration-75"
            />
          </div>
          {response && <div>Respuesta del servidor: {JSON.stringify(response)}</div>}
        </div>
      </form>
  );
};

export default Log;
