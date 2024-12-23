/* eslint jest/no-hooks: "error" */

import dbClient from '../utils/db';

describe('db client', () => {
  // Helper functions for setup and teardown
  const setupDatabase = async () => {
    await dbClient._connect();
  };

  const teardownDatabase = async () => {
    await dbClient.closeDatabase();
  };

  beforeAll(async () => {
    await setupDatabase();
  });

  afterAll(async () => {
    await teardownDatabase();
  });

  it('should connect to the database successfully', async () => {
    expect.hasAssertions();
    expect(dbClient.isAlive()).toBe(true);
    expect(dbClient.getDatabase()).toBeDefined();
  });

  it('should return the mongoose connection when connected', () => {
    expect.hasAssertions();
    const connection = dbClient.getDatabase();
    expect(connection).toBeDefined();
    expect(connection).toHaveProperty('connection');
  });

  it('should throw an error if getDatabase is called while disconnected', async () => {
    expect.hasAssertions();
    await teardownDatabase();
    expect(dbClient.isAlive()).toBe(false);
    expect(() => dbClient.getDatabase()).toThrow('Database not connected');
  });

  it('should close the database connection successfully', async () => {
    expect.hasAssertions();
    await setupDatabase();
    expect(dbClient.isAlive()).toBe(true);

    await teardownDatabase();
    expect(dbClient.isAlive()).toBe(false);
  });

  it('should handle connection failure gracefully', async () => {
    expect.hasAssertions();
    const invalidDBClient = new (class extends dbClient.constructor {
      constructor() {
        super();
        this.uri = 'mongodb://invalid_host:27017/test';
      }
    })();

    await invalidDBClient._connect();
    expect(invalidDBClient.isAlive()).toBe(false);
  });
});
