import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import Profile from "./pages/Profile";
import Log from "./pages/Log";
import Register from "./pages/Register";
import Drugs from "./pages/Drugs";
import Reminders from "./pages/Reminders";
import Story from "./pages/Story";
import Schedule from "./pages/Schedule";
import Doctors from "./pages/Doctors";
import GuestLayout from "./components/GuestLayout";
import AuthUserLayout from "./components/AuthUserLayout";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<GuestLayout />}>
          <Route index element={<Log />} />
          <Route index path="login" element={<Log />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route element={<AuthUserLayout />}>
          <Route path="profile" element={<Profile />} />
          <Route path="drugs" element={<Drugs />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="story" element={<Story />} />
          <Route path="reminders" element={<Reminders />} />
          <Route path="doctors" element={<Doctors />} />
        </Route>
        <Route path="*" element={<h1>Not found</h1>} />
      </>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
