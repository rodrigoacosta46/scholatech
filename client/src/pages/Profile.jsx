import AuthUserLayout from '../components/AuthUserLayout';

const Profile = () => {
  return (
    <AuthUserLayout>
      <div className="flex flex-col w-full">
        <div className="bg-green-950 w-full flex gap-2 p-6">
          <img
            src="img/Gaben.png"
            alt="Page LOGO"
            className="w-36 rounded-full"
          />
          <div className="flex flex-col">
            <div className="text-4xl text-white text-wrap max-h-28 overflow-hidden me-2">
              Hernandez Gutierrez Nunez
              <div className="h-px bg-white w-0"></div>
            </div>
            <p className="text-sm text-gray-500">Paciente</p>
          </div>
        </div>
      </div>
    </AuthUserLayout>
  );
};

export default Profile;
