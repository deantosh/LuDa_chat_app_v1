import React from 'react';
import '../styles/message.css';
import formatTimeStamp from '../dateFormatFunc';

const MessageComponent = ({ message }) => {
  const {senderId, text, createdAt} = message;

  // Format timestamp
  const formattedTimeStamp = new Date(createdAt).toLocaleString();

  return (
    <div className="message">
      <div className="message-header">
          <strong>{senderId.username}</strong><span>{formatTimeStamp(formattedTimeStamp)}</span>
      </div>
      <p>{text}</p>
    </div>
  );
};

// Export message component
export default MessageComponent;
