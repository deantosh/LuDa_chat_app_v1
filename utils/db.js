/**
 * Module defines a class DBClient
 * The class is used to create a DB instance for the LuDa chat application.
 * CRUD methods are also defined to allow easy access and reytrieval of data from the database.
 */
import mongoose from 'mongoose';

class DBClient {
  /**
   * Initialize database instance.
   */
  constructor() {
    // Get environment variables with defaults
    const dbHost = process.env.DB_HOST || 'localhost';
    const dbPort = process.env.DB_PORT || 27017;
    const dbName = process.env.DB_DATABASE || 'chat_app';

    // Create database URI
    this.uri = `mongodb://${dbHost}:${dbPort}/${dbName}`;

    // Create MongoDB client
    this.options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    // Initialize connection
    this.connected = false;
    this._connect();
  }

  /**
   * Instance method: checks for database connection.
   */
  async _connect() {
    try {
      await mongoose.connect(this.uri, this.options);
      this.connected = true;
      console.log('Connected to MongoDB...');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error.message);
      this.connected = false;
    }
  }

  /**
   * Check for db connection status
   * Returns true (success) or false (fails).
   */
  isAlive() {
    return this.connected;
  }

  /**
   * Gets the database connection instance.
   * @returns {Object} The connection instance.
   */
  getDatabase() {
    if (!this.connected) {
      throw new Error('Database not connected');
    }
    return mongoose.connection;
  }

  /**
   * Closes Mondodb connection.
   */
  async closeDatabase() {
    if (this.connected) {
      await mongoose.disconnect();
      this.connected = false;
      console.log('Disconnected from MongoDB');
    }
  }

  // CRUD OPERATIONS - STATIC METHODS

  /**
   * CREATE operation: Adds a new document to the collection.
   * @param {Object} model - The mongoose model to use.
   * @param {Objectt} data - The new document data.
   * @returns {Object} The created document.
   */
  static async create(model, data) {
    try {
      const doc = await model.create(data);
      return doc;
    } catch (error) {
      throw new Error('Error creating document:', error.message);
    }
  }

  /**
   * READ operation: Finds document using arbitrary query parameters.
   * @param {Object} model - The mongoose model to search for.
   * @param {Object} query - The query parameter.
   * @returns {Object} An array of matching documents.
   */
  static async find(model, query = {}) {
    try {
      const docs = await model.find(query).exec();
      return docs;
    } catch (error) {
      throw new Error('Error finding documents:', error.message);
    }
  }

  /**
   * READ operations - Finds only one document based on search query
   * @param {Object} model - The collection where document is.
   * @param {Object} query - The query to find document.
   * @returns The searched document.
   */
  static async findOne(model, query) {
    try {
      const doc = await model.findOne(query).exec();
      return doc;
    } catch (error) {
      throw new Error('Error finding document:', error.message);
    }
  }

  /**
   * UPDATE operation - Updates a document in a collection.
   * @param {Object} model - The collection where document is.
   * @param {Object} query - The query to find document.
   * @param {Object} updateData - The data to update document.
   * @returns {Object} The updated document.
   */
  static async update(model, query, updateData) {
    try {
      // Define options to return only the updated doc
      const options = { new: true };

      const updatedDoc = await model.findOneAndUpdate(query, updateData, options);
      if (!updatedDoc) {
        throw new Error('Document not found');
      }
      return updatedDoc;
    } catch (error) {
      throw new Error('Error updating document:', error.message);
    }
  }

  /**
   * DELETE operation - Deletes a document from collection.
   * @param {Object} model - The mongoose model where document is.
   * @pram {Object} query - The search query.
   * @returns {Object} The deleted document.
  */
  static async delete(model, query) {
    try {
      const deletedDoc = await model.findOneAndDelete(query);
      if (!deletedDoc) {
        throw new Error('Document not found');
      }
      return deletedDoc;
    } catch (error) {
      throw new Error('Error deleting document:', error.message);
    }
  }
}

// Export a singleton instance of DBClient
const dbClient = new DBClient();
export { dbClient, mongoose };
