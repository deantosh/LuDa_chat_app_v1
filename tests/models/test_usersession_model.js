/* eslint-disable jest/no-hooks */

/**
 * @jest-environment node
 */

import mongoose from 'mongoose';
import UserSession from '../../models/user_session';

describe('user_session model tests', () => {
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

  it('should create a new user session successfully', async () => {
    expect.assertions(4);

    const sessionData = {
      userId: new mongoose.Types.ObjectId(),
      token: 'unique_token_123',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    };

    const session = new UserSession(sessionData);
    const savedSession = await session.save();

    expect(savedSession._id).toBeDefined();
    expect(savedSession.userId.toString()).toBe(sessionData.userId.toString());
    expect(savedSession.token).toBe(sessionData.token);
    expect(savedSession.expiresAt).toStrictEqual(sessionData.expiresAt);
  });

  it('should throw a validation error if required fields are missing', async () => {
    expect.assertions(2);

    const session = new UserSession({});
    let error;

    try {
      await session.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.userId).toBeDefined();
  });

  it('should not allow duplicate tokens', async () => {
    expect.assertions(2);

    const sessionData = {
      userId: new mongoose.Types.ObjectId(),
      token: 'duplicate_token',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    };

    const session1 = new UserSession(sessionData);
    await session1.save();

    const session2 = new UserSession(sessionData);
    let error;

    try {
      await session2.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.code).toBe(11000);
  });

  it('should use default values for createdAt if not provided', async () => {
    expect.assertions(1);

    const sessionData = {
      userId: new mongoose.Types.ObjectId(),
      token: 'default_createdAt',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    };

    const session = new UserSession(sessionData);
    const savedSession = await session.save();

    expect(savedSession.createdAt).toBeDefined();
  });
});
