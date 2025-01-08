import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginOrSignup from './login/page';
import Dashboard from './dashboard/page';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginOrSignup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Redirect to login if no match */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
