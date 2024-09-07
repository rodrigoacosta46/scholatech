import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import Profile from './pages/Profile';
import Log from './pages/Log';
import Register from './pages/Register';
import Drugs from './pages/Drugs';
import Reminders from './pages/Reminders';
import Story from './pages/Story';
import Schedule from './pages/Schedule'; 
import Doctors from './pages/Doctors';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Log />} />
          <Route path="/login" element={<Log />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/drugs" element={<Drugs />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/story" element={<Story />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="*" element={<h1>Not found</h1>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
