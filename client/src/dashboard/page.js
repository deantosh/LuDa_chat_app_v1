import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import Chat from '../components/chat';

const Dashboard = () => {
  const [user, setUser] = useState("");
  const [rooms, setRooms] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
      axios.get('http://127.0.0.1:5000/users/dashboard').then(({ data }) => {
      setUser(data.user);
      setRooms(data.rooms);
      setUnreadMessages(data.unreadMessages);

      // Automatically select the first room (top room) if available
      if (data.rooms.length > 0) {
        setSelectedRoom(data.rooms[0]._id);
      }
    });
  }, []);

  return (
     <div className="dashboard">
       {/*Header component*/}
       <Header user={user} />
       {/*Sidebar component*/}
       <Sidebar
         rooms={rooms}
         unreadMessages={unreadMessages}
         setSelectedRoom={setSelectedRoom}
       />
       {/*Chat component*/}	  
       <div className="chat">
         {selectedRoom ? (
           <Chat roomId={selectedRoom} />
         ) : (
           <p>Select a room to view messages.</p>
         )}
       </div>
     </div>
  );
};

// Export dashboard component
export default Dashboard;
