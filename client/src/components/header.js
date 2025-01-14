import React, { useState, useEffect } from "react";
import '../styles/header.css';
import axios from "axios";


const Header = ({ user }) => {
  return (
    <header className="header">
      <div className="logo">
        <h1>LuDa Chat</h1>
      </div>
      <div className="user-info">
        {user ? (
          <span>Welcome, {user.username}</span>
        ) : (
          <span>Welcome, Guest</span>
        )}
      </div>
    </header>
  );
};

// Export header component
export default Header;
