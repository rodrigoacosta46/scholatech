import GuestLayout from '../components/GuestLayout';
import { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    birthdate: '',
    gender: 'male'
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
      const result = await axios.post('http://localhost:8000/registerauth', formData);
      setResponse(result.data); // Guarda la respuesta de la API
    } catch (error) {
      console.error('Error al registrar', error);
      setResponse(error.response?.data || 'Error en la solicitud');
    }
  };
  return (
      <form onSubmit={handleSubmit} method="POST">
        <div class="w-96 bg-white p-8 border-b-2 border-e-2 border-green-800 shadow-lg rounded-sm my-4">
          <p class="text-4xl text-green-800 text-center py-12">Register</p>
          <div class="flex flex-col gap-2 relative">
            <label for="email" class="text-green-950 mb-2 select-none">
              <input
                type="email"
                id="email"
                name="email"
                class="peer w-full p-2 border border-gray-300 rounded-focus:outline-green-600"
                required
                onChange={handleChange}
                value={formData.email}
              />
              <span class="peer-focus:bottom-14 relative bottom-[2.1rem] start-4 bg-white transition-all">
                Correo Electrónico
              </span>
            </label>
            <label for="username" class="text-green-950 mb-2 select-none">
              <input
                type="text"
                id="username"
                name="username"
                class="peer w-full p-2 border border-gray-300 rounded-focus:outline-green-600"
                required
                onChange={handleChange}
                value={formData.username}
              />
              <span class="peer-focus:bottom-14 relative bottom-[2.1rem] start-2 bg-white transition-all">
                Username
              </span>
            </label>

            <label for="password">
              <input
                type="text"
                id="password"
                name="password"
                class="peer w-full p-2 border border-gray-300 rounded-focus:outline-green-600"
                required
                onChange={handleChange}
                value={formData.password}
              />
              <span class="peer-focus:bottom-14 relative bottom-[2.1rem] start-2 bg-white transition-all">
                Password
              </span>
            </label>
            <label for="gender">
              Género:
              <select id="gender" name="gender" onChange={handleChange} value={formData.gender} class="outline-none">
                <option value="male">Hombre</option>
                <option value="female">Mujer</option>
              </select>
            </label>
            <label for="birthdate">
              Fecha de Nacimiento:
              <input type="date" id="birthdate" onChange={handleChange} value={formData.birthdates} name="birthdate" />
            </label>
            <input
              type="submit"
              id="submit"
              class="block w-full p-2 border border-gray-300 rounded-md cursor-pointer  hover:text-white hover:bg-green-800 transition-all duration-75"
            />
          </div>
          {response && <div>Respuesta del servidor: {JSON.stringify(response)}</div>}
        </div>
      </form>
  );
};

export default Register;
