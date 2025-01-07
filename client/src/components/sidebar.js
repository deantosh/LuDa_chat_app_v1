import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/sidebar.css';

const Sidebar = ({ rooms, unreadMessages, setSelectedRoom }) => {
  return (
    <div className="sidebar">
      <h2>Your Rooms</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room._id}>
            <Link to="#" onClick={() => setSelectedRoom(room._id)}>
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
      <Link to="/create-room">
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
