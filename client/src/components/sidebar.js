import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import '../styles/sidebar.css';
import axios from "axios";


const Sidebar = () => {
  const [user, setUser] = useState("");
  const [rooms, setRooms] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/users/dashboard", { withCredentials: true })
      .then(({ data }) => {
        setUser(data.user);
        setRooms(data.rooms);
        setUnreadMessages(data.unreadMessages);
      })
      .catch((err) => {
        console.error("Error:", err.response ? err.response.data : err);
      });
  }, []);

  return (
    <div className="sidebar">
      <h2>Your Rooms</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room._id}>
            <Link to="#" >
              {room.name}
              {unreadMessages[room._id] > 0 && (
                <span className="badge">
                  {unreadMessages[room._id]}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>

      {/* Link to create a new room page */}
      <Link to="/room">
        <button>Create New Room</button>
      </Link>

      {/* Link to view all rooms page */}
      <Link to="/rooms">
        <button>View All Rooms</button>
      </Link>
    </div>
  );
};

// Export sidebar component
export default Sidebar;
