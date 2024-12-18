/**
 * Module defines a Reaction model.
 * Model stores reactions (e.g emojis) to messages.
 */
import mongoose from 'mongoose';

const reactionSchema = new mongoose.Schema({
  messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reactionType: { type: String, required: true },
});

// Register and export Reaction model
const Reaction = mongoose.model(reactionSchema);
export default Reaction;
