const { dbClient } = require('../utils/db');

describe('db client', () => {
  beforeEach(async () => {
      await dbClient.initialize();
  });

  // Close db connection after test
  afterAll(async () => {
    await dbClient.closeDatabase();
  });

  it('should connect to the database successfully', async () => {
    expect.hasAssertions();
    expect(await dbClient.isAlive()).toBe(true);
    expect(dbClient.getDatabase()).toBeDefined();
  });

  it('should return the mongoose connection when connected', () => {
    expect.hasAssertions();
    const connection = dbClient.getDatabase();
    expect(connection.readyState).toBe(1);
  });

  it('should throw an error if getDatabase is called while disconnected', async () => {
    expect.hasAssertions();
    await dbClient.closeDatabase();
    expect(await dbClient.isAlive()).toBe(false);
    expect(() => dbClient.getDatabase()).toThrow('Database not connected');
  });

  it('should close the database connection successfully', async () => {
    expect.hasAssertions();
    expect(await dbClient.isAlive()).toBe(true);

    await dbClient.closeDatabase();
    expect(await dbClient.isAlive()).toBe(false);
  });
});
