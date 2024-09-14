import AuthUserLayout from '../components/AuthUserLayout';

const Schedule = () => {
  const date = new Date();

  let month = date.getMonth();
  let year = date.getFullYear();  
  return (
      <h1>Página de Calendario</h1>
  );
};

export default Schedule;
