const React = require('react');
const { useState, useEffect } = require('react');
const axios = require('axios');
const Sidebar = require('./sidebar');
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
      <Sidebar
        rooms={rooms}
        unreadMessages={unreadMessages}
        setSelectedRoom={setSelectedRoom}
      />
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
