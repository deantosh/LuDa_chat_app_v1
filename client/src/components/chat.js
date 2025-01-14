import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MessageComponent from './message';
import '../styles/chat.css';

const Chat = ({ user, selectedRoom }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Fetch messages for the selected room
  useEffect(() => {
    if (selectedRoom) {
      axios.get(`http://localhost:5000/rooms/${selectedRoom}/messages`)
        .then(({ data }) => {
          setMessages(data.messages);
        })
        .catch((error) => {
          console.error('Error fetching messages:', error);
        });
    }
  }, [selectedRoom]);

  // Function to handle sending a new message
  const handleSendMessage = () => {
    const tempMessage = newMessage;
      setNewMessage(''); // Clear the input field
    if (tempMessage.trim()) {
      axios.post(
        `http://localhost:5000/rooms/${selectedRoom}/messages`,
	{
            text: tempMessage,
	    roomId: selectedRoom,
	    senderId: user._id,
	},
	{ withCredentials: true }
      )
      .then(({ data }) => {
        // Add the new message to the messages list
          setMessages((prevMessages) => [...prevMessages, data.messageData]);
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
    }
  };

  return (
    <div className="chat">
      {/* Messages list */}
      <div className="messages-list">
	{messages.length === 0 ? (
          <p>No messages</p>
	) : (
          messages.map((message) => (
            <MessageComponent key={message._id} message={message} />
          ))
	)}
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
