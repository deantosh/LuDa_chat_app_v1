import React, { useState, useContext } from "react";
import axios from "axios";
import "../styles/room.css";
import { UserContext } from "../dashboard/page";

const RoomCreation = ({ onRoomAdded }) => {
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);

  // Handle creation of new room
  const handleRoomCreation = async () => {
    if (!roomName.trim()) {
      alert("Room name is required!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/rooms", {
        name: roomName,
        description,
        isPrivate,
        createdBy: user._id,
        members: [user._id],
      });

      // Pass the new room to the parent component to update the room list
      onRoomAdded(response.data.room);

      // Reset form fields
      setRoomName("");
      setDescription("");
      setIsPrivate(false);
      alert("Room created successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to create room.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="room-creation-form">
      <h2>Create New Room</h2>
      <input
        type="text"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="Room Name"
        disabled={loading}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Room Description"
        disabled={loading}
      />
      <label>
        Private:
        <input
          type="checkbox"
          checked={isPrivate}
          onChange={() => setIsPrivate(!isPrivate)}
          disabled={loading}
        />
      </label>
      <button onClick={handleRoomCreation} disabled={loading}>
        {loading ? "Creating..." : "Create Room"}
      </button>
    </div>
  );
};

// Export room component
export default RoomCreation;
