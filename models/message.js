/**
 * Module defines Message model.
 * Message model contains messages sent by users in the chat room.
 */
const { mongoose } = require('../utils/db');
const baseSchema = require('./base_model');

const messageSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String },
  attachments: [{ type: String }],
  reactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reaction' }],
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }],
});

// Extend Schema with baseSchema
messageSchema.add(baseSchema);

// Register and export message model
const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
