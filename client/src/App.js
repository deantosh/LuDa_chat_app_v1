import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginOrSignup from './login/page';
import Dashboard from './dashboard/page';
import RoomCreation from './room/page';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginOrSignup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/room" element={<RoomCreation />} />
        {/* Redirect to login if no match */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
