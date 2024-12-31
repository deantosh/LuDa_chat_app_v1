/**
 * Modules defines users model.
 * User model contains details of application registered users.
 */
const { mongoose } = require('../utils/db');
const baseSchema = require('./base_model');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  avatar: { type: String },
  status: { type: String, default: 'Available' },
  isOnline: { type: Boolean, default: false },
});

// Extend Schema with baseSchema
userSchema.add(baseSchema);

// Register user model and export user object
const User = mongoose.model('User', userSchema);
module.exports = User;
