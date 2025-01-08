import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import '../styles/room.css';

const RoomDetails = () => {
  const { roomId } = useParams(); // Extract roomId from the URL
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(`/rooms/${roomId}`);
        setRoom(response.data.room);
        setLoading(false);
      } catch (err) {
        setError('Failed to load room details.');
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  if (loading) return <div className="loading">Loading room details...</div>;
  if (error) return <div className="error">{error}</div>;

  const memberCount = room.members ? room.members.length : 0;

  return (
    <div className="room-details-page">
      <Header />
      <div className="room-details-container">
        <Sidebar />
        <div className="room-details-content">
          <h1>{room.name}</h1>
          <p>{room.description}</p>
          {/* Display the number of members */}
          <p><strong>Number of Members:</strong> {memberCount}</p>
          
          {/* Add more room details here */}
          <div className="room-actions">
            {/* Placeholder for additional room actions */}
            <button>Join Room</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
