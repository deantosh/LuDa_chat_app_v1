import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/sidebar';
import Header from '../components/header';

const RoomCreation = ({ onRoomCreated }) => {
  const [roomName, setRoomName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [userId, setUserId] = useState(null);  // To store the logged-in user ID

  // Fetch the current user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/users/me', {
	  withCredentials: true,
        });
        setUserId(response.data.id);  // Set the logged-in user ID
      } catch (error) {
        console.error('Failed to fetch user:', error);
        alert('Failed to fetch user details.');
      }
    };
    fetchUser();
  }, []);  // Runs only once on component mount

  const handleRoomCreation = async () => {
    if (roomName.trim() && userId) {
      try {
        const response = await axios.post('http://localhost:5000/rooms', {
          name: roomName,
          description,
          isPrivate,
          createdBy: userId,
          members: [userId]
        });

        // Pass the new room to the parent component to update the room list
        onRoomCreated(response.data);

        // Reset form fields
        setRoomName('');
        setDescription('');
        setIsPrivate(false);
        alert('Room created successfully!');
      } catch (error) {
        console.error(error);
        alert('Failed to create room.');
      }
    } else {
      alert('Room name and user data are required!');
    }
  };

    return (
    {/*Header component*/}
    <Header user={user} />
    {/*Sidebar component*/}
    <Sidebar
      rooms={rooms}
      unreadMessages={unreadMessages}
      setSelectedRoom={setSelectedRoom}
    />
    <div className="create-room">
      <h2>Create New Room</h2>
      <input
        type="text"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="Room Name"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Room Description"
      />
      <label>
        Private:
        <input
          type="checkbox"
          checked={isPrivate}
          onChange={() => setIsPrivate(!isPrivate)}
        />
      </label>
      <button onClick={handleRoomCreation}>Create Room</button>
    </div>
  );
};

// Export room component
export default RoomCreation;
