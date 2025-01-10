import React, { useState, useEffect } from "react";
import '../styles/header.css';
import axios from "axios";


const Header = () => {
  const [user, setUser] = useState(""); // To store the logged-in user ID
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users/me", {
          withCredentials: true,
        });
        setUser(response.data.user); // Set the logged-in user ID
      } catch (error) {
        console.error("Failed to fetch user:", error);
        alert("Failed to fetch user details.");
      }
    };
    fetchUser();
  }, []); // Runs only once on component mount
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
