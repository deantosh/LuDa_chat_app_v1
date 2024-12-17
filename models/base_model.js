/**
 * Module defines BaseModel for all other models.
 */
import mongoose from 'mongoose';

const { Schema } = mongoose;

const baseSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Customize object before converting to JSON
 */
baseSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// Update the updatedAt field when document is updated.
baseSchema.pre('save', (next) => {
  this.updatedAt = Date.now();
  next();
});

// Export
export default baseSchema;
