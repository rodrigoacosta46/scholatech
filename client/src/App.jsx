import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import Profile from './pages/Profile';
import Log from './pages/Log';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/login" element={<Log />} />
        </Routes>
      </Router>
      <Profile />
    </>
  );
}

export default App;
