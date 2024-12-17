/**
 * Module defines a class DBClient
 */
import mongoose from 'mongoose';

class DBClient {
  /**
   * Initialize class
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
   * Check connection status
   */
  isAlive() {
    return this.connected;
  }

  /**
   * Returns the Mongoose connection instance
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
export default dbClient;
