import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/header";
import Chat from "../components/chat";
import "../styles/dashboard.css";
import axios from "axios";

const Dashboard = () => {
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
    <>
      {/*Header component*/}
      <Header user={user} />
      <div className="dashboard">
        {/*Sidebar component*/}
        <Sidebar />
        {/*Chat component*/}
        <div className="chat">
          <Chat user={user} />
          <p>Select a room to view messages.</p>
        </div>
      </div>
    </>
  );
};

// Export dashboard component
export default Dashboard;
