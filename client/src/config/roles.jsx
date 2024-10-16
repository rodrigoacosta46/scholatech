export const roles = {
  pacient: "Paciente",
  doctor: "Doctor",
  admin: "Admin",
};

export const config = {
  theme: {
    admin: "red",
    doctor: "blue",
    pacient: "green",
  },
  nav: {
    admin: {
      "Información general": {
        route: "/profile",
        icon: "fa-sharp-duotone fa-solid fa-heart-circle-exclamation fa-light pe-2",
      },
      Notificaciones: {
        route: "/reminders",
        icon: "fa-solid fa-envelope pe-2",
      },
      "Listado de usuarios": {
        route: "/list",
        icon: "fa-solid fa-users pe-2",
      },
      "Información de medicamentos": {
        route: "/drugs",
        icon: "fa-solid fa-prescription-bottle-medical pe-2",
      },
    },
    doctor: {
      "Información general": {
        route: "/profile",
        icon: "fa-sharp-duotone fa-solid fa-heart-circle-exclamation fa-light pe-2",
      },
      Notificaciones: {
        route: "/reminders",
        icon: "fa-solid fa-envelope pe-2",
      },
      "Historial de Consultas": {
        route: "/assignments",
        icon: "fa-solid fa-box-archive pe-2"  
      },
      Tratamientos: {
        route: "/treatments",
        icon: "fa-solid fa-stethoscope pe-2"
      },
      Calendario: {
        route: "/schedule",
        icon: "fa-regular fa-calendar-days pe-2",
      },
      "Información de medicamentos": {
        route: "/drugs",
        icon: "fa-solid fa-prescription-bottle-medical pe-2",
      },
    },
    pacient: {
      "Información general": {
        route: "/profile",
        icon: "fa-sharp-duotone fa-solid fa-heart-circle-exclamation fa-light pe-2",
      },
      Notificaciones: {
        route: "/reminders",
        icon: "fa-solid fa-envelope pe-2",
      },
      Doctores: {
        route: "/doctors",
        icon: "fa-solid fa-user-doctor pe-2",
      },
      Historial: {
        route: "/story",
        icon: "fa-solid fa-box-archive pe-2",
      },
      Calendario: {
        route: "/schedule",
        icon: "fa-regular fa-calendar-days pe-2",
      },
      "Información de medicamentos": {
        route: "/drugs",
        icon: "fa-solid fa-prescription-bottle-medical pe-2",
      },
    },
  },
};
