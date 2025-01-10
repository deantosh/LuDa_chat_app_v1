/**
 * Module defines BaseModel for all other models.
 */
const { mongoose } = require('../utils/db');

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
baseSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

/**
 * Static CRUD methods
 */

// CREATE: Adds and saves new document to the collection
baseSchema.statics.createDoc = async function (data) {
  return this.create(data);
};

// READ: Finds documents using arbitrary query parameters
// baseSchema.statics.findDocs = async function (query = {}, options = {}) {
//   try {
//     // Paginate results
//     const { limit = 10, skip = 0 } = options;
//     const docs = await this.find(query).limit(limit).skip(skip);
//     return this.find(query).limit(limit).skip(skip);
//     return docs;
//   } catch (error) {
//     throw new Error(`Error finding documents: ${error.message}`);
//   }
// };

// Refactor findDocs to return the Mongoose query object instead of resolving it, as mentioned earlier:
baseSchema.statics.findDocs = function (query = {}, options = {}, fields = null) {
  const { limit = 10, skip = 0 } = options; // Extract pagination options

  // Return the query object to allow chaining
  return this.find(query)
    .select(fields) // Select specific fields if provided
    .limit(limit)
    .skip(skip);
};

// READ: Finds a single document using a query -- return queryObject
baseSchema.statics.findOneDoc = function (query, projection = null) {
  try {
    // Get the query object that supports chaining
    return this.findOne(query, projection);
  } catch (error) {
    throw new Error(`Error finding document: ${error.message}`);
  }
};

// UPDATE: Updates a document in the collection
baseSchema.statics.updateDoc = async function (query, updateData) {
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
baseSchema.statics.deleteDoc = async function (query) {
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
module.exports = baseSchema;
