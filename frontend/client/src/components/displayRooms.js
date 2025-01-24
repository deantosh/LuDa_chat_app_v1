import '../styles/room.css';

const RoomsDisplay = ({ rooms, onRoomView }) => {
  return (
    <div className="rooms-content">
      <h1>Available Rooms</h1>
      <div className="room-cards">
        {rooms.map((room) => (
          <div key={room._id} className="room-card">
            <h2>{room.name}</h2>
            <p>{room.description}</p>
              <button className="view-room-btn" onClick={() => onRoomView(room)}>
                View Room
              </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomsDisplay;
