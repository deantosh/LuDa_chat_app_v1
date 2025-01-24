/**
 * @jest-environment node
 */
const { dbClient, mongoose } = require('../../utils/db');
const User = require('../../models/user');

jest.setTimeout(30000);

describe('user model tests', () => {
  beforeAll(async () => {
      await User.init();
      console.log('Indexes created for the User model');
  });

  afterAll(async () => {
    // Close the database connection
      await dbClient.closeDatabase();
  });

  it('should create a new user successfully', async () => {
    expect.assertions(7);

    const userData = {
      username: 'testuser',
      email: 'testuser@example.com',
      passwordHash: 'hashed_password',
      avatar: 'https://example.com/avatar.png',
    };

    const user = await User.createDoc(userData);

    expect(user._id).toBeDefined();
    expect(user.username).toBe(userData.username);
    expect(user.email).toBe(userData.email);
    expect(user.passwordHash).toBe(userData.passwordHash);
    expect(user.avatar).toBe(userData.avatar);
    expect(user.status).toBe('Available');
    expect(user.isOnline).toBe(false);
  });

  it('should throw validation error if required fields are missing', async () => {
    expect.assertions(4);

    let error;

    try {
      await User.createDoc({});
    } catch (err) {
      error = err;
    }

    // Ensure the error is defined and is a ValidationError
    expect(error).toBeDefined();
    expect(error instanceof mongoose.Error.ValidationError).toBe(true);

    expect(error.errors.username).toBeDefined();
    expect(error.errors.email).toBeDefined();
  });

  it('should not allow duplicate usernames or emails', async () => {
    expect.assertions(3);

    let error;

    const userData = {
      username: 'uniqueuser',
      email: 'uniqueuser@example.com',
      passwordHash: 'hashed_password',
    };

    try {
      const user1 = await User.createDoc(userData);
	const user2 = await User.createDoc(userData);
	console.log('User1', user1);
	console.log('User2', user2);
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.name).toBe('MongoServerError');
    expect(error.code).toBe(11000);
  });

  it('should use default values for status and isOnline', async () => {
    expect.assertions(2);

    const userData = {
      username: 'defaultuser',
      email: 'defaultuser@example.com',
      passwordHash: 'hashed_password',
    };

    const user = await User.createDoc(userData);

    expect(user.status).toBe('Available');
    expect(user.isOnline).toBe(false);
  });
});
