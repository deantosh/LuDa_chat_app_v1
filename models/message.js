/**
 * Module defines Message model
 */
import mongoose from 'mongoose';
import baseSchema from './base_model';

const messageSchema = mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String },
  attachments: [{ type: String }],
  reactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reaction' }],
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }],
});

// Include baseSchema
messageSchema.add(baseSchema);

// Register and export message model
const Message = mongoose.model('Message', messageSchema);
export default Message;
