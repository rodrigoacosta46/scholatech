import GuestLayout from '../components/GuestLayout';

const Register = () => {
  return (
    <GuestLayout>
      <form action="/registerauth" method="POST">
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
              />
              <span class="peer-focus:bottom-14 relative bottom-[2.1rem] start-2 bg-white transition-all">
                Password
              </span>
            </label>
            <label for="gender">
              Género:
              <select id="gender" name="gender" class="outline-none">
                <option value="male">Hombre</option>
                <option value="female">Mujer</option>
              </select>
            </label>
            <label for="birthdate">
              Fecha de Nacimiento:
              <input type="date" id="birthdate" name="birthdate" />
            </label>
            <input
              type="submit"
              id="submit"
              class="block w-full p-2 border border-gray-300 rounded-md cursor-pointer  hover:text-white hover:bg-green-800 transition-all duration-75"
            />
          </div>
        </div>
      </form>
    </GuestLayout>
  );
};

export default Register;
