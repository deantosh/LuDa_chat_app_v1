/*
 * Module defines class RedisClient to be used in session management.
 */
import { createClient } from 'redis';

class RedisClient {
  constructor() {
    // Initialize class
    this.client = createClient({
      url: 'redis://127.0.0.1:6379',
    });

    // Use promise to handle connection state
    this.connectPromise = new Promise((resolve, reject) => {
      // If connected successful
      this.client.on('connect', () => {
        resolve(true);
      });

      // If not connected successful
      this.client.on('error', (err) => {
	console.log('Redis connection error:', err);
	reject(false);
      });
    });
  }

  /**
   * Checks if connection is successful.
   */
  async isAlive() {
    return await this.connectPromise;
  }

  /**
   * Set user token, its value (userId).
   */
  async set(key, value, duration) {
    try {
      const result = await new Promise((resolve, reject) => {
        this.client.set(key, value, 'EX', duration, (err, reply) => {
          if (err) reject(err);
          else resolve(reply);
        });
      });
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
      const value = await new Promise((resolve, reject) => {
        this.client.get(key, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
      return value;
    } catch (err) {
      return null;
    }
  }

  async del(key) {
    try {
      const result = await new Promise((resolve, reject) => {
        this.client.del(key, (err, reply) => {
          if (err) reject(err);
          else resolve(reply);
        });
      });
      return result;
    } catch (error) {
      return null;
    }
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;
