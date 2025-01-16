import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/sidebar";
import Header from "../components/header";
import "../styles/room.css";

const RoomCreation = ({ onRoomCreated }) => {
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [user, setUser] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Fetch the current user details
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
  }, []); // Runs only once on component mount

  // Function to set selectedRoom
  const onRoomSelect = (roomId) => {
    setSelectedRoom(roomId);
  }

  // Handle creation of new room
  const handleRoomCreation = async () => {
    if (roomName.trim() && user._id) {
      try {
        const response = await axios.post("http://localhost:5000/rooms", {
          name: roomName,
          description,
          isPrivate,
          createdBy: user._id,
          members: [user._id],
        });

        // Pass the new room to the parent component to update the room list
        onRoomCreated = response.data;

        // Reset form fields
        setRoomName("");
        setDescription("");
        setIsPrivate(false);
        alert("Room created successfully!");
      } catch (error) {
        console.error(error);
        alert("Failed to create room.");
      }
    } else {
      alert("Room name and user data are required!");
    }
  };

  return (
    <>
      {/*Header component*/}
      <Header user={user} />
      <div className="create-room">
      {/*Sidebar component*/}
      <Sidebar onRoomSelect={onRoomSelect} />
      <div className="room-creation-form">
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
      </div>
    </>
  );
};

// Export room component
export default RoomCreation;
