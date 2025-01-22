import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import MessageComponent from './message';
import { SocketContext } from '../dashboard/page';
import '../styles/chat.css';

const Chat = ({ user, selectedRoom }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { socket } = useContext(SocketContext);

  // Initialize socket connection
  useEffect(() => {
    if (selectedRoom) {
      // Join the selected room
      socket.current.emit('joinRoom', selectedRoom._id);

      // Listen for new messages from the server
      socket.current.on('newMessage', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      // Cleanup on component unmount
      return () => {
        socket.current.emit('leaveRoom', selectedRoom._id);
      };
    }
  }, [selectedRoom, socket]);

  // Fetch messages for the selected room
  useEffect(() => {
    if (selectedRoom) {
      axios
        .get(`http://localhost:5000/rooms/${selectedRoom._id}/messages`)
        .then(({ data }) => {
          setMessages(data.messages);
        })
        .catch((error) => {
          console.error('Error fetching messages:', error);
        });
    }
  }, [selectedRoom]);

  // Scroll to the bottom every time messages are updated
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  // Function to handle sending a new message
  const handleSendMessage = () => {
    const tempMessage = newMessage;
    setNewMessage(''); // Clear the input field
    if (tempMessage.trim()) {
      const messageData = {
        text: tempMessage,
        roomId: selectedRoom._id,
        senderId: user._id,
      };

      // Save the message to the database
      axios
        .post(`http://localhost:5000/rooms/${selectedRoom._id}/messages`, messageData, {
          withCredentials: true,
        })
      .then(({ data }) => {
        console.log('Message saved to database:', data.populatedMessage);
      })
      .catch((error) => {
          console.error('Error sending message:', error);
      });
    }
  };

  return (
    <div className="chat">
      <div className="chat-header">
        <h3 className="room-name"> {selectedRoom.name} </h3>
        <button className="exit-btn">Exit room</button>
      </div>
      {/* Messages list */}
      <div className="messages-list">
	{messages.length === 0 ? (
          <p className="no-text">No messages</p>
	) : (
          messages.map((message) => (
            <MessageComponent key={message._id.toString()} message={message} />
          ))
	)}
        {/* This ensures the chat scrolls to the bottom*/}
        <div ref={messagesEndRef} />
      </div>

      {/* Textarea for sending new messages */}
      {selectedRoom && (
        <div className="message-input">
          <textarea
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      )}

    </div>
  );
};

// Export chat component
export default Chat;
