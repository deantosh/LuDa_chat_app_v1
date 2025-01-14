import React from 'react';
import '../styles/message.css';

const MessageComponent = ({ message }) => {
  return (
    <div className="message">
      <p><strong>{message.senderId.username}</strong>: {message.text}</p>
    </div>
  );
};

// Export message component
export default MessageComponent;
