import React, { useState, useEffect } from "react";
import "../styles/header.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Header = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOPen] = useState(false);
  const navigate = useNavigate();

  // Toggle dropdown visibility
  const toggleDropdown = () => setIsDropdownOPen((prevState) => !prevState);

  // handle route to profile settings
  const handleProfileSettings = () => {
    navigate("/profile-settings");
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.delete("http://localhost:5000/users/logout", {
        withCredentials: true,
      });
      navigate("/"); // Back to login/ signup page
    } catch (error) {
      console.log("Error logging out", error.message);
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <h1>LuDa Chat</h1>
      </div>
      <div className="user-info">
        {user ? (
          <>
            <span>Welcome, {user.username}</span>
            <div className="avatar-container" onClick={toggleDropdown}>
              <div className="avatar">
                <img src={user.avatar} alt="User Avatar" />
                <div
                  className={`status-circle ${
                    user.isOnline ? "online" : "offline"
                  }`}
                ></div>
              </div>
              {isDropdownOpen && (
                <div className="dropdown">
                  <ul>
                  <li onClick={handleProfileSettings}>Profile Settings</li>
                  <li onClick={handleLogout}>Logout</li>
                  </ul>
                </div>
              )}
            </div>
          </>
        ) : (
          <span>Welcome, Guest</span>
        )}
      </div>
    </header>
  );
};

// Export header component
export default Header;
