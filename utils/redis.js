/*
 * Module defines class RedisClient to be used in session management.
 */
const { createClient } = require('redis');

class RedisClient {
  /**
   * Initialize class
   */
  constructor() {
    // Start redis connection
    this.client = createClient({
      url: 'redis://127.0.0.1:6379',
    });

    // Flag: track connection status
    this.connectionPromise = this.connect();
  }
    
  async connect() {
    try {
      // Complete connection handshake
      await this.client.connect();
      console.log('Redis client connected successfully');
    } catch (err) {
      console.log('Redis connection error:', err);
    }
  }

  /**
   * Wait until Redis is ready (connected)
   */
  async waitForConnection() {
    await this.connectionPromise;
  }

  /**
   * Checks if connection is successful.
   */
  async isAlive() {
    await this.waitForConnection();
    return this.client.isReady;
  }

  /**
   * Set user token, its value (userId).
   */
  async set(key, value, duration) {
    try {
      const result = await this.client.set(key, value, { 'EX': duration });
      return result;
    } catch(err) {
      return null;
    }
  }

  /**
   * Get userId using token
   */
  async get(key) {
    try {
      const value = await this.client.get(key);
      return value;
    } catch (err) {
      return null;
    }
  }

  async del(key) {
    try {
      const result = await this.client.del(key);
      return result;
    } catch (error) {
      return null;
    }
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
module.exports = redisClient;
