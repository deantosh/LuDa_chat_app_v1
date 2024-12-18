/**
 * Module defines userSession model.
 * Model tracks user login sessions.
 */
import mongoose from 'mongoose';
import baseSchema from './base_model';

const userSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  isValid: { type: Boolean, default: true },
  expiresAt: { type: Date, required: true },
});

// Include baseSchema
userSessionSchema.add(baseSchema);

// Register and export model
const userSession = mongoose.model(userSessionSchema);
export default userSession;
