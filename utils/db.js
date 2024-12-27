/**
 * Module defines a class DBClient
 * The class is used to create a DB instance for the LuDa chat application.
 * CRUD methods are also defined to allow easy access and reytrieval of data from the database.
 */
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

class DBClient {
  /**
   * Initialize database instance.
   */
  constructor({ useInMemory = false } = {}) {
    this.useInMemory = useInMemory;
    // Flag: tracks connection status
    this.connected = false;
    this.uri = null;
    this.connectionPromise = this.initialize();
  }

  /**
   * Instance method: checks for database connection.
   */
  async _connect() {
    try {
      // Get database type
      const dbType = process.env.DB_TYPE || 'default';

      // Switch between databases on test and development
      if (dbType === 'testDB') {
        const memoryServer = await MongoMemoryServer.create();
        this.uri = memoryServer.getUri();
      } else {
        // Handle: mongodb
        const dbHost = process.env.DB_HOST || 'localhost';
        const dbPort = process.env.DB_PORT || 27017;
        const dbName = process.env.DB_DATABASE || 'chat_app';
        this.uri = `mongodb://${dbHost}:${dbPort}/${dbName}`;
      }

      await mongoose.connect(this.uri);
      this.connected = true;
      console.log('Connected to MongoDB...');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error.message);
      this.connected = false;
      throw error;
    }
  }

  // Initialize connection and store the promise
  async initialize() {
    if (this.connectionPromise){
      await this.connectionPromise;
      return;
    }
    this.connectionPromise = await this._connect();
  }

  // Wait until the connection is ready
  async waitForConnection() {
    if (this.connectionPromise) {
      await this.connectionPromise; // Ensure connection is complete
    }
  }

  /**
   * Check for db connection status
   * Returns true (success) or false (fails).
   */
  async isAlive() {
    await this.waitForConnection();
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
}

// Export a singleton instance of DBClient
const dbClient = new DBClient();
module.exports = { dbClient, mongoose };
