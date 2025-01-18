import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/sidebar.css';
import axios from "axios";


const Sidebar = ({ onRoomSelect }) => {
  const [user, setUser] = useState("");
  const [rooms, setRooms] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

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

  // Handle room click
  const handleRoomClick = (roomId) => {
    onRoomSelect(roomId);

    if (location.pathname !== "/dashboard") {
      navigate("/dashboard", { state: { roomId } });
    }
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
