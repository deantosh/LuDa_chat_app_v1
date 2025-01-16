import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import '../styles/room.css';

const RoomsDisplay = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null); // object id

  // Fetch rooms from the API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users/me", {
          withCredentials: true,
        });
        setUser(response.data.user); // Set the logged-in user ID
      } catch (error) {
        console.error("Failed to fetch user:", error);
        alert("Failed to fetch user details.");
      }
    };

    fetchUser();
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:5000/rooms');
        setRooms(response.data.rooms);
        setLoading(false);
      } catch (err) {
        setError('Failed to load rooms. Please try again later.');
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Function to set selectedRoom
  const onRoomSelect = (roomId) => {
    setSelectedRoom(roomId);
  }

  if (loading) return <div className="loading">Loading rooms...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="rooms-page">
      <Header user={user} />
      <div className="rooms-container"> 
        <Sidebar onRoomSelect={onRoomSelect} />
        <div className="rooms-content">
          <h1>Available Rooms</h1>
          <div className="room-cards">
            {rooms.map((room) => (
              <div key={room._id} className="room-card">
                <h2>{room.name}</h2>
                    <p>{room.description}</p>
		<Link to={`/rooms/${room._id}`}>
                  <button className="view-room-btn">
                    View Room
                  </button>
		</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomsDisplay;
