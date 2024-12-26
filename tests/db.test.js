const { dbClient } = require('../utils/db');

describe('db client', () => {
  // Helper functions for setup and teardown
  const setupDatabase = async () => {
    await dbClient._connect();
  };

  const teardownDatabase = async () => {
    await dbClient.closeDatabase();
  };

  beforeAll(async () => {
    jest.setTimeout(10000);
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
    expect(connection.readyState).toBe(1);
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
});
