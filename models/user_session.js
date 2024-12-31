/**
 * Module defines userSession model.
 * Model tracks user login sessions.
 */
const { mongoose } = require('../utils/db');
const baseSchema = require('./base_model');

const userSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  isValid: { type: Boolean, default: true },
  expiresAt: { type: Date, required: true },
});

// Extend Schema with baseSchema
userSessionSchema.add(baseSchema);

// Register and export model
const UserSession = mongoose.model('UserSession', userSessionSchema);
module.exports = UserSession;
