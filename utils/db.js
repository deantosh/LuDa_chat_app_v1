// Module defines a class DBClient
import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    // Get environment variables with defaults
    const dbHost = process.env.DB_HOST || 'localhost';
    const dbPort = process.env.DB_PORT || 27017;
    const dbName = process.env.DB_DATABASE || 'chat_app';

    // Create database URI
    const uri = `mongodb://${dbHost}:${dbPort}`;

    // Create MongoDB client
    this.client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Set initial values
    this.connected = false;
    this.database = null;

    // Initialize connection
    this._connect(dbName);
  }

  async _connect(dbName) {
    try {
      await this.client.connect();
      this.database = this.client.db(dbName);
      this.connected = true;
      console.log(`Connected to MongoDB: ${dbName}`);
    } catch (error) {
      console.error('Error connecting to MongoDB:', error.message);
    }
  }

  // Get the database instance
  getDatabase() {
    if (!this.connected) {
      throw new Error('Database not connected');
    }
    return this.database;
  }
}

// Export a singleton instance of DBClient
const dbClient = new DBClient();
export default dbClient;
