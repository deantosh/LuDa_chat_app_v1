/**
 * Module defines Reply model
 */
import mongoose from 'mongoose';
import baseSchema from './base_model';

const { Schema } = mongoose;

const replySchema = new Schema({
  messageId: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
    required: true,
  },
  senderId: {
    type: Schema.Types.ObjectId,
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
      type: Schema.Types.ObjectId,
      ref: 'Reaction',
    },
  ],
  parentReplyId: {
    type: Schema.Types.ObjectId,
    ref: 'Reply',
    default: null,
  },
});

// Add the base schema (timestamps, soft deletes, etc.)
replySchema.add(baseSchema);

// Register and export Reply model
const Reply = mongoose.model('Reply', replySchema);

export default Reply;
