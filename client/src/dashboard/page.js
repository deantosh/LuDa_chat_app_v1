import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
import Sidebar from "../components/sidebar";
import Header from "../components/header";
import Chat from "../components/chat";
import RoomCreation from "../components/createRoom";
import RoomsDisplay from "../components/displayRooms"
import "../styles/dashboard.css";

// Context for global user data
export const UserContext = createContext();

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomDetailsId, setRoomDetailsId] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [view, setView] = useState("home");

  // Fetch current logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users/me", {
          withCredentials: true,
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  // Fetch rooms from the API when the user is loaded
  useEffect(() => {
    axios
      .get("http://localhost:5000/users/dashboard", { withCredentials: true })
      .then(({ data }) => {
        setRooms(data.rooms);
      })
      .catch((err) => {
        console.error("Error:", err.response ? err.response.data : err);
      });
  }, []);

  // Add the newly created room to the rooms list
  const handleRoomAdded = (newRoom) => {
    setRooms((prevRooms) => [...prevRooms, newRoom]);
  };

  // Handlers for changing view

  const handleRoomSelect = (roomId) => {
    setSelectedRoom(roomId);
    setView("chat");
  }

  // Function to render the active component
  const renderView = () => {
    if (view === "chat") {
      return selectedRoom ? (
        <Chat user={user} selectedRoom={selectedRoom} />
      ) : (
        <p className="no-selected-room">Select a room to view messages.</p>
      );
    }
    if (view === "create-room") {
      return <RoomCreation onRoomAdded={handleRoomAdded} />;
    }
    if (view === "rooms") {
      return (
        <RoomsDisplay rooms={rooms} setView={setView} />
      );
    }
    if (view === "view-room-details") {
      return (
        <RoomDetails />
      )
    }
    return <p>Select an option from the sidebar.</p>;
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      
      {/*Header component*/}
      <Header user={user} />      

      <div className="dashboard">

        {/*Sidebar component*/}
        <Sidebar setView={setView} onRoomSelect={handleRoomSelect}/>
        
        {/*Main content component*/}
        <div className="content-container">{renderView()}</div>
      </div>
    </UserContext.Provider>
  );
};

// Export dashboard component
export default Dashboard;
