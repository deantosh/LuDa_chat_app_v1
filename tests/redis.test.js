/**
 * Module defines a test for redis.js.
 * Tests the in-memory store used for application session management.
 */

import redisClient from '../utils/redis';

describe('redis Client Tests', () => {
  describe('isAlive()', () => {
    it('should return true when Redis is connected', async () => {
      expect.assertions(1);
      const redisAlive = await redisClient.isAlive();
      expect(redisAlive).toBe(true);
    });
  });

  describe('set() and get()', () => {
    it('should store and retrieve values', async () => {
      expect.assertions(2);
      const key = 'testKey';
      const value = 'testValue';
      const duration = 10;

      // Set a value in Redis
      const setResult = await redisClient.set(key, value, duration);
      expect(setResult).toBe('OK');

      // Retrieve the value from Redis
      const getResult = await redisClient.get(key);
      expect(getResult).toBe(value);
    });
  });

  describe('get()', () => {
    it('should return null for non-existent keys', async () => {
      expect.assertions(1);
      const nonExistentKey = 'nonExistentKey';
      const result = await redisClient.get(nonExistentKey);
      expect(result).toBeNull();
    });
  });

  describe('del()', () => {
    it('should remove a key from Redis', async () => {
      expect.assertions(2);
      const key = 'keyToDelete';
      const value = 'valueToDelete';

      // Set a key
      await redisClient.set(key, value, 10);

      // Delete the key
      const delResult = await redisClient.del(key);
      expect(delResult).toBe(1);

      // Ensure the key no longer exists
      const getResult = await redisClient.get(key);
      expect(getResult).toBeNull();
    });
  });
});
