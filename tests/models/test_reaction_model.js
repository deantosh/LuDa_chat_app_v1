/* eslint-disable jest/no-hooks */

/**
 * @jest-environment node
 */

import mongoose from 'mongoose';
import Reaction from '../../models/reaction';

describe('reaction model tests', () => {
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

  it('should create a new reaction successfully', async () => {
    expect.assertions(4);

    const reactionData = {
      messageId: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(),
      reactionType: '👍', // using this emoji for testing purpose
    };

    const reaction = new Reaction(reactionData);
    const savedReaction = await reaction.save();

    expect(savedReaction._id).toBeDefined();
    expect(savedReaction.messageId.toString()).toBe(reactionData.messageId.toString());
    expect(savedReaction.userId.toString()).toBe(reactionData.userId.toString());
    expect(savedReaction.reactionType).toBe(reactionData.reactionType);
  });

  it('should throw validation error if required fields are missing', async () => {
    expect.assertions(3);

    const reaction = new Reaction({});
    let error;

    try {
      await reaction.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.messageId).toBeDefined();
    expect(error.errors.userId).toBeDefined();
  });

  it('should throw validation error for missing reactionType', async () => {
    expect.assertions(2);

    const reactionData = {
      messageId: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(),
    };

    const reaction = new Reaction(reactionData);
    let error;

    try {
      await reaction.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.reactionType).toBeDefined();
  });

  it('should handle duplicate reactions correctly if constraints are set', async () => {
    expect.assertions(2);

    const reactionData = {
      messageId: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(),
      reactionType: '❤️', // using this emoji for testing purpose
    };

    const reaction1 = new Reaction(reactionData);
    await reaction1.save();

    const reaction2 = new Reaction(reactionData);
    let error;

    try {
      await reaction2.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.code).toBe(11000);
  });
});
