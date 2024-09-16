import { useEffect, useState } from "react";
import Title from "../../components/Title";

const Schedule = () => {
  const [nav, setNav] = useState(1);
  const [display, setDisplay] = useState({});

  const date = new Date();
  const day = date.getDay();
  const month = date.getMonth();
  const year = date.getFullYear();

  useEffect(() => {
    let years = [];
    let months = [];
    let days = [];
    let selectedDate = date;

    for (let i = 0; i < 3; i++) {
      let flag = i - 1; // Mes anterior, actual y próximo
      selectedDate = new Date(year, month + nav + flag); // Mes actual del for

      selectedDate.setDate(0); // Día final del mes anterior, a su vez se selecciona mes anterior
      let monthDays = selectedDate.getDate(); // Obtengo último día del mes anterior

      selectedDate.setDate(1); // Primer día del mes anterior
      let firstMonthDay = selectedDate.getDay(); // Obtengo día de la semana del primer día del mes anterior
      let displayedDays = firstMonthDay + monthDays; // Cantidad total de celdas

      years[i] = selectedDate.getFullYear();
      months[i] = selectedDate.toLocaleString("es", { month: "long" }); //  Guarda mes del loop
      days[i] = []; // Guarda los días del mes del loop

      for (let j = 1; j <= displayedDays; j++) {
        if (j > firstMonthDay) {
          days[i][j] = {
            num: j - firstMonthDay,
          };
          continue;
        }
        days[i][j] = {
          num: "",
        };
      }
    }
    setDisplay({
      ...display,
      before: {
        ...display.before,
        title: months[0] + " de " + years[0],
        content: days[0],
        styles: "opacity-15",
      },
      current: {
        ...display.current,
        title: months[1] + " de " + years[1],
        content: days[1],
        styles: "bg-white animate-slideIn opacity-100 static z-30",
      },
      after: {
        ...display.after,
        title: months[2] + " de " + years[2],
        content: days[2],
        styles: "opacity-15 ",
      },
    });
  }, [nav]);

  return (
    <>
      <Title txt="Calendario personal" allowAnimations={true} />

      <div className="relative flex flex-col gap-14 m-8">
        <div className="flex items-center justify-between h-96">
          <button
            className="absolute start-0 z-30 text-2xl h-full"
            onClick={() => {
              setNav(nav - 1);
            }}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button
            className="absolute end-0 z-30 text-2xl h-full"
            onClick={() => {
              setNav(nav + 1);
            }}
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
          <div className="flex justify-center w-full">
            {Object.entries(display).map(([key, val]) => (
              <div
                className={"flex flex-col " + val.styles}
                key={Math.random()}
              >
                <p className="text-2xl text-thin text-wrap text-green-900 text-center p-4">
                  {val.title}
                </p>
                <div className="grid grid-cols-7 place-items-center h-full">
                  <p>D</p>
                  <p>L</p>
                  <p>M</p>
                  <p>M</p>
                  <p>J</p>
                  <p>V</p>
                  <p>S</p>
                  {val.content.map((d) => (
                    <div className=" w-full h-full border border-dashed p-1">
                      <p className="text-start">{d.num}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="border-b-2 border-green-900 text-2xl text-green-950 font-thin">
          Eventos
        </p>
      </div>
    </>
  );
};

export default Schedule;
