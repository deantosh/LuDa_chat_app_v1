import React, { useContext } from "react";
import axios from "axios";
import "../styles/room.css";
import { UserContext } from "../dashboard/page";

const RoomDetails = ({ rooms, room, onRoomAdded }) => {
  const { user } = useContext(UserContext);

  // Join the room
  const joinRoom = async () => {
    if (user && room) {
      try {
        // Handle user is already a member in room
        const isRoomPresent = rooms.some(
          (existingRoom) => existingRoom._id === room._id
        )
        if (!room.isPrivate && !isRoomPresent) {
          const response = await axios.post(
	    `http://localhost:5000/rooms/${room._id}/users/${user._id}/join`
          );
          console.log('Joined room successfully:', response.data);
          
          // Add room to the sidebar
          onRoomAdded(response.data.room);
        } else {
	console.log('Private room contact Room Admin');
      }
      } catch (err) {
        console.error('Failed to join room:', err);
        alert('Error joining room');
      }
    }
  };

  // Get the number of members in a room
  const memberCount = room.members ? room.members.length : 0;

  return (
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
  );
};

export default RoomDetails;
