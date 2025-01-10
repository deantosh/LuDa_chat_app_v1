import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/header";
import Chat from "../components/chat";
import "../styles/dashboard.css";

const Dashboard = () => {
  return (
    <>
      {/*Header component*/}
      <Header />
      <div className="dashboard">
        {/*Sidebar component*/}
        <Sidebar />
        {/*Chat component*/}
        <div className="chat">
          <Chat/>
          <p>Select a room to view messages.</p>
        </div>
      </div>
    </>
  );
};

// Export dashboard component
export default Dashboard;
