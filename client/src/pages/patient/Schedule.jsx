import Title from '../../components/Title';
import Calendar from '../../components/Calendar';
import { userHook } from '../../hooks/userHook';
import Section from '../../components/Section';

const Schedule = () => {
  const { userConfig } = userHook();

  return (
    <>
      <Title
        txt="Calendario personal"
        allowAnimations={true}
        scheme={userConfig.theme}
      />

      <div className="relative flex flex-col gap-14 m-8">
        <Calendar scheme={userConfig.theme} />
        <Section txt="eventos" scheme={userConfig.theme} />
      </div>
    </>
  );
};

export default Schedule;
