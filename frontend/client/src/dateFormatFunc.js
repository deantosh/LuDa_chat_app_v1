// utils.js or inside your component file
function formatTimestamp(dateString) {
  const messageDate = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // Check if the message was sent today
  if (
    messageDate.getDate() === today.getDate() &&
    messageDate.getMonth() === today.getMonth() &&
    messageDate.getFullYear() === today.getFullYear()
  ) {
    return `Today ${messageDate.toLocaleTimeString()}`;
  }

  // Check if the message was sent yesterday
  if (
    messageDate.getDate() === yesterday.getDate() &&
    messageDate.getMonth() === yesterday.getMonth() &&
    messageDate.getFullYear() === yesterday.getFullYear()
  ) {
    return `Yesterday ${messageDate.toLocaleTimeString()}`;
  }

  // For other dates, return the full date and time
  return messageDate.toLocaleString();
}

export default formatTimestamp;
