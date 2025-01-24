import React, { useState, useEffect, createContext, useRef } from "react";
import { io } from 'socket.io-client';
import axios from "axios";
import Sidebar from "../components/sidebar";
import Header from "../components/header";
import Chat from "../components/chat";
import RoomCreation from "../components/createRoom";
import RoomsDisplay from "../components/displayRooms";
import RoomDetails from "../components/viewRoomDetails";
import ProfileForm from "../components/userProfileSettings";
import "../styles/dashboard.css";

// Context for global data
export const UserContext = createContext();
export const SocketContext = createContext();

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomDetails, setRoomDetails] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [userRooms, setUserRooms] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [view, setView] = useState("home");

  // Create a socket reference
  const socket = useRef(null);
 
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

  // Initialize socket connection when user is logged in
  useEffect(() => {
    if (user) {
      socket.current = io("http://localhost:5000");  // Initialize socket

      // Cleanup on component unmount
      return () => {
        if (socket.current) {
          socket.current.disconnect();
        }
      };
    }
  }, [user]);

  // Fetch all available rooms
  useEffect(() => {
    axios
      .get("http://localhost:5000/rooms")
      .then(({ data }) => {
        setRooms(data.rooms);
      })
      .catch((err) => {
        console.error("Error:", err.response ? err.response.data : err);
      });
  }, []);

  // Fetch user rooms -- to be used in the sidebar
  useEffect(() => {                                                             
    axios                                                                       
      .get("http://localhost:5000/users/dashboard", { withCredentials: true })  
      .then(({ data }) => {                                                     
        setUserRooms(data.rooms);                                                   
        setUnreadMessages(data.unreadMessages);                                 
      })                                                                        
      .catch((err) => {                                                         
        console.error("Error:", err.response ? err.response.data : err);        
      });                                                                       
  }, []);

  // Add the newly created room to the rooms list
  const handleRoomAdded = (newRoom) => {
    setUserRooms((prevRooms) => [...prevRooms, newRoom]);
  };

  // Handlers for changing view

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setView("chat");
  }

  const handleViewRoomDetails = (room) => {
    setRoomDetails(room);
    setView("view-room-details")
  }

  // Function to remove the room from the user's sidebar (userRooms)
  const removeRoomFromSidebar = (roomId) => {
    setUserRooms((prevRooms) => prevRooms.filter((room) => room._id !== roomId));
  };

  // Function to render the active component
  const renderView = () => {
    if (view === "chat") {
      return selectedRoom ? (
        <Chat
          user={user}
          selectedRoom={selectedRoom}
          removeRoomFromSidebar={removeRoomFromSidebar}
          setSelectedRoom={setSelectedRoom}
          setView={setView}
        />
      ) : (
        <p className="no-selected-room">Select a room to view messages.</p>
      );
    }
    if (view === "create-room") {
      return <RoomCreation onRoomAdded={handleRoomAdded} />;
    }
    if (view === "rooms") {
      return (
        <RoomsDisplay rooms={rooms} onRoomView={handleViewRoomDetails} />
      );
    }
    if (view === "view-room-details") {
      return (
        <RoomDetails
          rooms={userRooms }
          room={roomDetails}
          onRoomAdded={handleRoomAdded}
        />
      )
    }
    if (view === "profile-settings") {
      return ( <ProfileForm />);
    }
    return <p className="no-selected-room">Select a room to view message</p>;
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <SocketContext.Provider value={{ socket: socket.current }}>
        {/*Header component*/}
        <Header user={user} setView={setView} />      

        <div className="dashboard">

          {/*Sidebar component*/}
          <Sidebar
            userRooms={userRooms}
            unreadMessages={unreadMessages}
            setView={setView}
            onRoomSelect={handleRoomSelect}
          />
        
          {/*Main content component*/}
          <div className="content-container">{renderView()}</div>
        </div>
      </SocketContext.Provider>
    </UserContext.Provider>
  );
};

// Export dashboard component
export default Dashboard;
