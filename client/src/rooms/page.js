import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import '../styles/room.css';

const RoomsDisplay = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  // Fetch rooms from the API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('/rooms'); // Ensure this matches your API route
        setRooms(response.data.rooms);
        setLoading(false);
      } catch (err) {
        setError('Failed to load rooms. Please try again later.');
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleRoomClick = (roomId) => {
    // Navigate to the detailed room page
    navigate(`/rooms/${roomId}`);
  };

  if (loading) return <div className="loading">Loading rooms...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="rooms-page">
      <Header />
      <div className="rooms-container">
        <Sidebar />
        <div className="rooms-content">
          <h1>Available Rooms</h1>
          <div className="room-cards">
            {rooms.map((room) => (
              <div key={room._id} className="room-card">
                <h2>{room.name}</h2>
                <p>{room.description}</p>
                <button
                  className="view-room-btn"
                  onClick={() => handleRoomClick(room._id)}
                >
                  View Room
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomsDisplay;
