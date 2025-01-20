import '../styles/sidebar.css';

const Sidebar = ({ userRooms, unreadMessages, setView, onRoomSelect }) => {

  // Handle room click
  const handleRoomClick = (roomId) => {
    onRoomSelect(roomId);
    setView("chat");
  }

  return (
    <div className="sidebar">
      <h2>Your Rooms</h2>
      <ul>
        {userRooms.map((room) => (
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
