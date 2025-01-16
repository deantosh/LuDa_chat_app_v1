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
  const [user, setUser] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null) // object id

  useEffect(() => {
    // Fetch current user details
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

    // Fetch room details
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/rooms/${roomId}`);
        setRoom(response.data.room);
        setLoading(false);
      } catch (err) {
	  console.log(err.message)
          setError('Failed to load room details:');
        setLoading(false);
      }
    };
    fetchRoomDetails();
  }, [roomId]);

  // Join the room
  const joinRoom = async () => {
    if (user && room) {
      try {
        if (!room.isPrivate) {
          const response = await axios.post(
	    `http://localhost:5000/rooms/${room._id}/users/${user._id}/join`
          );
          console.log('Joined room successfully:', response.data);
        } else {
	console.log('Private room contact Room Admin');
      }
      } catch (err) {
        console.error('Failed to join room:', err);
        alert('Error joining room');
      }
    }
  };

  // Function to set selectedRoom
  const onRoomSelect = (roomId) => {
    setSelectedRoom(roomId);
  }

  if (loading) return <div className="loading">Loading room details...</div>;
  if (error) return <div className="error">{error}</div>;

  // Get the number of members in a room
  const memberCount = room.members ? room.members.length : 0;

  return (
    <div className="room-details-page">
      <Header user={user} />
      <div className="room-details-container">
        <Sidebar onRoomSelect={onRoomSelect} />
	<div className="room-details-content">
          <h1>{room.name}</h1>
          <p>{room.description}</p>
	  {room.isPrivate ? (
	    <>
              <p>Room is: private</p>
              <p>Contact creator:</p>
              <p>{room.createdBy.username}: {room.createdBy.email}</p>
	    </>
	  ) : (
            <p>Room is: public (Anyone can join)</p>
	  )}
          <p>Date created: {room.createdAt}</p>
          <p>Members: {memberCount}</p>
          <div className="room-actions">
            <button onClick={joinRoom}>Join Room</button>
          </div>
	</div>
      </div>
    </div>
  );
};

export default RoomDetails;
