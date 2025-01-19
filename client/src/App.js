import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginOrSignup from './login/page';
import Dashboard from './dashboard/page';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect to User login / signup page */}}
        <Route path="/" element={<LoginOrSignup />} />

        {/* Redirect to the user account */}}
        <Route path="/account" element={<Dashboard />} />

        {/* Redirect to login if no match */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
