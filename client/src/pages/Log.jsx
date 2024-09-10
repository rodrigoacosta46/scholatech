
const Log = () => {
  return (
      <form action="/loginauth" method="POST">
        <div className="w-96 bg-white p-8 border-b-2 border-e-2 border-green-800 shadow-lg rounded-sm">
          <p className="text-4xl text-green-800 text-center py-12">Login</p>
          <div className="flex flex-col gap-2 relative">
            <label for="username" className="text-green-950 mb-2 select-none">
              <input
                type="text"
                name="username"
                id="username"
                className="peer w-full p-2 border border-gray-300 rounded-mfocus:outline-green-600"
              />
              <span className="peer-focus:bottom-14 relative bottom-[2.1rem] start-4 bg-white transition-all">
                Username
              </span>
            </label>
            <label for="password" className="text-green-950 mb-2 select-none">
              <input
                type="text"
                name="password"
                id="password"
                className="peer w-full p-2 border border-gray-300 rounded-mfocus:outline-green-600"
              />
              <span className="peer-focus:bottom-14 relative bottom-[2.1rem] start-4 bg-white transition-all">
                Password
              </span>
            </label>
            <label for="remind" className="flex gap-[2px]">
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
        </div>
      </form>
  );
};

export default Log;
