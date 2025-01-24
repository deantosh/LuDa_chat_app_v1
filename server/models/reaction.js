/**
 * Module defines a Reaction model.
 * Reaction model stores reactions (e.g emojis) to messages.
 */
const { mongoose } = require('../utils/db');
const baseSchema = require('./base_model');

const reactionSchema = new mongoose.Schema({
  messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reactionType: { type: String, required: true },
});

// Extend Schema with baseSchema
reactionSchema.add(baseSchema);

// Register and export Reaction model
const Reaction = mongoose.model('Reaction', reactionSchema);
module.exports = Reaction;
