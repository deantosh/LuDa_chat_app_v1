/**
 * Module defines BaseModel for all other models.
 */
import { mongoose } from '../utils/db';

const baseSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
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

/**
 * Static CRUD metsthods
 */

// CREATE: Adds a new document to the collection
baseSchema.statics.createDoc = async (data) => {
  try {
    const doc = await this.create(data);
    return doc;
  } catch (error) {
    throw new Error(`Error creating document: ${error.message}`);
  }
};

// READ: Finds documents using arbitrary query parameters
baseSchema.statics.findDocs = async (query = {}, options = {}) => {
  try {
    // Paginate results
    const { limit = 10, skip = 0 } = options;
    const docs = await this.find(query).limit(limit).skip(skip).exec();
    return docs;
  } catch (error) {
    throw new Error(`Error finding documents: ${error.message}`);
  }
};

// READ: Finds a single document using a query
baseSchema.statics.findOneDoc = async (query, projection = null) => {
  try {
    const doc = await this.findOne(query, projection).exec();
    return doc;
  } catch (error) {
    throw new Error(`Error finding document: ${error.message}`);
  }
};

// UPDATE: Updates a document in the collection
baseSchema.statics.updateDoc = async (query, updateData) => {
  try {
    const options = { new: true }; // Return the updated document
    const updatedDoc = await this.findOneAndUpdate(query, updateData, options);
    if (!updatedDoc) {
      throw new Error('Document not found');
    }
    return updatedDoc;
  } catch (error) {
    throw new Error(`Error updating document: ${error.message}`);
  }
};

// DELETE: Deletes a document from the collection
baseSchema.statics.deleteDoc = async (query) => {
  try {
    const deletedDoc = await this.findOneAndDelete(query);
    if (!deletedDoc) {
      throw new Error('Document not found');
    }
    return deletedDoc;
  } catch (error) {
    throw new Error(`Error deleting document: ${error.message}`);
  }
};

// Export
export default baseSchema;
