/* eslint-disable jest/no-hooks */

/**
 * @jest-environment node
 */

import mongoose from 'mongoose';
import User from '../../models/user';

describe('user model tests', () => {
  beforeAll(async () => {
    // Connect to the test database
    await mongoose.connect('mongodb://localhost:27017/test_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Drop the database and close the connection
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  it('should create a new user successfully', async () => {
    expect.assertions(7);

    const userData = {
      username: 'testuser',
      email: 'testuser@example.com',
      passwordHash: 'hashed_password',
      avatar: 'https://example.com/avatar.png',
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(userData.username);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.passwordHash).toBe(userData.passwordHash);
    expect(savedUser.avatar).toBe(userData.avatar);
    expect(savedUser.status).toBe('Available');
    expect(savedUser.isOnline).toBe(false);
  });

  it('should throw validation error if required fields are missing', async () => {
    expect.assertions(3);

    const user = new User({});
    let error;

    try {
      await user.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.username).toBeDefined();
    expect(error.errors.email).toBeDefined();
  });

  it('should not allow duplicate usernames or emails', async () => {
    expect.assertions(2);

    const userData = {
      username: 'uniqueuser',
      email: 'uniqueuser@example.com',
      passwordHash: 'hashed_password',
    };

    const user1 = new User(userData);
    await user1.save();

    const user2 = new User(userData);
    let error;

    try {
      await user2.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.code).toBe(11000);
  });

  it('should use default values for status and isOnline', async () => {
    expect.assertions(2);

    const userData = {
      username: 'defaultuser',
      email: 'defaultuser@example.com',
      passwordHash: 'hashed_password',
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser.status).toBe('Available');
    expect(savedUser.isOnline).toBe(false);
  });
});
