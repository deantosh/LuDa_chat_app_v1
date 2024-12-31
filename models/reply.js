/**
 * Module defines Reply model
 */
const { mongoose } = require('../utils/db');
const baseSchema = require('./base_model');

const replySchema = new mongoose.Schema({
  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
  },
  attachments: [
    {
      type: String,
    },
  ],
  reactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reaction',
    },
  ],
  parentReplyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reply',
    default: null,
  },
});

// Add the base schema (timestamps, soft deletes, etc.)
replySchema.add(baseSchema);

// Register and export Reply model
const Reply = mongoose.model('Reply', replySchema);
module.exports = Reply;
