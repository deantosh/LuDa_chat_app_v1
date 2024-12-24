// Module defines a class DBClient
import dbClient from './DBClient';

describe('DBClient', () => {
  beforeAll(async () => {
    // Ensure the database connection is established before running tests
    await new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (dbClient.connected) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
  });

  afterAll(async () => {
    // Close the database connection after tests
    await dbClient.client.close();
  });

  test('should connect to the database successfully', () => {
    expect(dbClient.connected).toBe(true);
    expect(dbClient.database).not.toBeNull();
  });

  test('should retrieve the correct database name', () => {
    const dbName = process.env.DB_DATABASE || 'chat_app';
    expect(dbClient.database.databaseName).toBe(dbName);
  });

  test('should throw an error if trying to get the database before connection', async () => {
    const tempDbClient = new (class extends dbClient.constructor {
      constructor() {
        super();
        this.connected = false; // Simulate disconnected state
      }
    })();

    expect(() => tempDbClient.getDatabase()).toThrowError('Database not connected');
  });

  test('should be able to insert and retrieve data from a collection', async () => {
    const testCollection = dbClient.getDatabase().collection('test_collection');
    const testData = { name: 'Test User', message: 'Hello, world!' };

    // Insert data
    const result = await testCollection.insertOne(testData);
    expect(result.insertedCount).toBe(1);

    // Retrieve data
    const retrievedData = await testCollection.findOne({ _id: result.insertedId });
    expect(retrievedData.name).toBe('Test User');
    expect(retrievedData.message).toBe('Hello, world!');

    // Clean up
    await testCollection.deleteOne({ _id: result.insertedId });
  });
});
