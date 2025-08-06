import Notifications from "../../components/Notifications";
import Title from "../../components/Title";
import VerticalScroller from "../../components/VerticalScroller";
import { userHook } from "../../hooks/userHook";


const Reminders = () => {
  const { userConfig } = userHook();

  const notificationModel = (registro, i) => {
    const serverFullDate = new Date("2024-11-04T04:34:30Z");
    const currentFullDate = new Date();
    const serverDate = new Date(
      serverFullDate.getFullYear(),
      serverFullDate.getMonth(),
      serverFullDate.getDate()
    );
    const currentDate = new Date(
      currentFullDate.getFullYear(),
      currentFullDate.getMonth(),
      currentFullDate.getDate()
    );
    return (
      <div key={"k-" + i}>
        {registro.NewGroupFlag ? (
          <div
            className={`relative h-px my-2 grow-0 bg-slate-400 text-slate-500 text-lg mt-16`}
          >
            <span className="bg-gray-300 absolute -top-4 start-0 end-0 mx-auto w-fit pointer-events-none px-2">
              {serverDate == currentDate
                ? "Hoy"
                : new Date(registro.Notificacion.CreatedAt).toLocaleDateString(
                    "es-ES"
                  )}
            </span>
          </div>
        ) : (
          ""
        )}
        <Notifications
          id={registro.Notificacion.ID}
          title={registro.Notificacion.Title}
          message={registro.Notificacion.Mensaje}
          state={registro.Notificacion.Estado}
        />
      </div>
    );
  };

  return (
    <>
      <Title
        txt="Notificaciones"
        allowAnimations={true}
        scheme={userConfig.theme}
      />

      <div className="flex flex-col gap-28 m-8 transition-all">
        <div className="flex flex-col">
          <VerticalScroller
            url={String(process.env.REACT_APP_API_URL
  + "/getNotifications")}
            renderModel={notificationModel}
            empty="No tenes notificaciones en el buzón de entrada"
          />
        </div>
      </div>
    </>
  );
};

export default Reminders;
