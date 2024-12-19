/**
 * Module defines room model.
 * Room model contains the application chat room details.
 */
import { mongoose } from '../utils/db';
import baseSchema from './base_model';

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  isPrivate: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

// Extend Schema with baseSchema
roomSchema.add(baseSchema);

// Register Room model and export object
const Room = mongoose.model('Room', roomSchema);
export default Room;
