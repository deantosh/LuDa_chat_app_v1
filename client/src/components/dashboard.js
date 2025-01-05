const React = require('react');
const { useState, useEffect } = require('react');
const axios = require('axios');
const { Link } = require('react-router-dom');
const Chat = require('./Chat');

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/users/dashboard').then(({ data }) => {
      setRooms(data.rooms);
      setUnreadMessages(data.unreadMessages);

      // Automatically select the first room (top room) if available
      if (data.rooms.length > 0) {
        setSelectedRoom(data.rooms[0]._id);
      }
    });
  }, []);

  return (
    <div className="dashboard">
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

      <div className="chat">
        {selectedRoom ? (
          <Chat roomId={selectedRoom} />
        ) : (
          <p>Select a room to view messages.</p>
        )}
      </div>
    </div>
  );
};

// Export dashboard component
module.exports = Dashboard;

