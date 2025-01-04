const React = require('react');
const { useEffect, useState } = React;
const axios = require('axios');
const MessageComponent = require('./MessageComponent');

const Chat = ({ roomId }) => {
  const [messages, setMessages] = useState([]); // State for storing messages
  const [newMessage, setNewMessage] = useState(''); // State for storing the text of the new message

  // Fetch messages for the selected room
  useEffect(() => {
    if (roomId) {
      axios.get(`http://localhost:5000/rooms/${roomId}/messages`)
        .then(({ data }) => {
          setMessages(data.messages);
        })
        .catch((error) => {
          console.error('Error fetching messages:', error);
        });
    }
  }, [roomId]);

  // Function to handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      axios.post(`http://localhost:5000/rooms/${roomId}/messages`, { text: newMessage })
        .then(({ data }) => {
          // Add the new message to the messages list
          setMessages((prevMessages) => [...prevMessages, data.message]);
          setNewMessage(''); // Clear the input field
        })
        .catch((error) => {
          console.error('Error sending message:', error);
        });
    }
  };

  return (
    <div className="chat-container">
      {/* Messages list */}
      <div className="messages-list">
        {messages.map((message) => (
          <MessageComponent key={message._id} message={message} />
        ))}
      </div>

      {/* Textarea for sending new messages */}
      <div className="message-input">
        <textarea
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

// Export chat component
module.exports = Chat;
