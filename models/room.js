/**
 * Module defines room model.
 */
import mongoose from 'mongoose';
import baseSchema from './base_model';

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  isPrivate: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

// Extend with baseSchema
roomSchema.add(baseSchema);

// Register Room model and export object
const Room = mongoose.model('Room', roomSchema);
export default Room;
