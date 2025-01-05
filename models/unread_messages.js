/**
 * Modle defines unread message model.
 * Track unread messages for each user in each room.
 */
const { mongoose } = require('../utils/db');

const unreadMessagesSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  unreadCount: { type: Number, default: 0 }
});

const UnreadMessage = mongoose.model('UnreadMessage', unreadMessagesSchema);

// Export model
module.exports = UnreadMessage;
