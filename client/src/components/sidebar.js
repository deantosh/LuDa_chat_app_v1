import React, { useState, useEffect } from "react";
import '../styles/sidebar.css';
import axios from "axios";


const Sidebar = ({ setView, onRoomSelect }) => {
  const [rooms, setRooms] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/users/dashboard", { withCredentials: true })
      .then(({ data }) => {
        setRooms(data.rooms);
        setUnreadMessages(data.unreadMessages);
      })
      .catch((err) => {
        console.error("Error:", err.response ? err.response.data : err);
      });
  }, []);

  // Handle room click
  const handleRoomClick = (roomId) => {
    onRoomSelect(roomId);
    setView("chat");
  }

  return (
    <div className="sidebar">
      <h2>Your Rooms</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room._id}>
	    <button onClick={() => handleRoomClick(room._id)}>
              {room.name}
              {unreadMessages[room._id] > 0 && (
                <span className="badge">
                  {unreadMessages[room._id]}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {/* Button to create a new room */}
      <button onClick={() => setView("create-room")}>Create New Room</button>

      {/* Button to view all rooms */}
      <button onClick={() => setView("rooms")}>View All Rooms</button>

    </div>
  );
};

// Export sidebar component
export default Sidebar;
