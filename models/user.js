/**
 * Modules defines users model.
 */
import mongoose from 'mongoose';
import baseSchema from './base_model';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  avatar: { type: String },
  status: { type: String, default: 'Available' },
  isOnline: { type: Boolean, default: false },
});

// Include baseSchema
userSchema.add(baseSchema);

// Register user model and export user object
const User = mongoose.model('User', userSchema);
export default User;
