import React from 'react';

const MessageComponent = ({ message }) => {
  return (
    <div className="message">
      <p><strong>{message.sender}</strong>: {message.content}</p>
    </div>
  );
};

// Export message component
module.exports = MessageComponent;
