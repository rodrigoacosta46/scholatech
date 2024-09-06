import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import Profile from './pages/Profile';
import Log from './pages/Log';
import Register from './pages/Register';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Log />} />
          <Route path="/login" element={<Log />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<h1>Not found</h1>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
