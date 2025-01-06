import React from 'react';
import '../styles/header.css';

const Header = ({ user }) => {
  return (
    <header className="header">
      <div className="logo">
        <h1>ChatApp</h1>
      </div>
      <div className="user-info">
        {user ? (
          <span>Welcome, {user.name}</span>
        ) : (
          <span>Welcome, Guest</span>
        )}
      </div>
    </header>
  );
};

// Export header component
export default Header;
