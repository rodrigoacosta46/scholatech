import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import GuestLayout from "./components/GuestLayout";
import AuthUserLayout from "./components/AuthUserLayout";
import Profile from "./pages/patient/Profile";
import Log from "./pages/Log";
import Register from "./pages/Register";
import Drugs from "./pages/patient/Drugs";
import Reminders from "./pages/patient/Reminders";
import Story from "./pages/patient/Story";
import Schedule from "./pages/patient/Schedule";
import Doctors from "./pages/patient/Doctors";
import Select from "./pages/patient/Select";
import { UserContextProvider } from "./hooks/userHook";
import ProtectedRoute from "./components/ProtectedRoute";
import { roles } from "./config/roles";
import List from "./pages/List";
import React from "react";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<GuestLayout />}>
          <Route index element={<Log />} />
          <Route index path="login" element={<Log />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route element={<UserContextProvider />}>
          <Route element={<AuthUserLayout />}>
            <Route path="profile" element={<Profile />} />
            <Route path="drugs" element={<Drugs />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="story" element={<Story />} />
            <Route path="reminders" element={<Reminders />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="select/:uuid" element={<Select />} />
            <Route element={<ProtectedRoute bypassRole={roles.admin}/>}>
              <Route path="list" element={<List />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<h1>Not found</h1>} />
      </> 
    )
  );
  return <RouterProvider router={router} />;
}

export default App;