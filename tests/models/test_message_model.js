/* eslint-disable jest/no-hooks */

/**
 * @jest-environment node
 */

import mongoose from 'mongoose';
import Message from '../../models/message';

describe('message model tests', () => {
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

  it('should create a new message successfully', async () => {
    expect.assertions(5);

    const messageData = {
      roomId: new mongoose.Types.ObjectId(),
      senderId: new mongoose.Types.ObjectId(),
      text: 'Hello world',
      attachments: ['image.png'],
    };

    const message = new Message(messageData);
    const savedMessage = await message.save();

    expect(savedMessage._id).toBeDefined();
    expect(savedMessage.roomId.toString()).toStrictEqual(messageData.roomId.toString());
    expect(savedMessage.senderId.toString()).toStrictEqual(messageData.senderId.toString());
    expect(savedMessage.text).toStrictEqual(messageData.text);
    expect(savedMessage.attachments).toStrictEqual(messageData.attachments);
  });

  it('should throw validation error if required fields are missing', async () => {
    expect.assertions(2);

    const message = new Message({});
    let error;

    try {
      await message.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.roomId).toBeDefined();
  });

  it('should handle optional fields correctly', async () => {
    expect.assertions(4);

    const messageData = {
      roomId: new mongoose.Types.ObjectId(),
      senderId: new mongoose.Types.ObjectId(),
    };

    const message = new Message(messageData);
    const savedMessage = await message.save();

    expect(savedMessage._id).toBeDefined();
    expect(savedMessage.text).toBeUndefined();
    expect(savedMessage.attachments).toStrictEqual([]);
    expect(savedMessage.reactions).toStrictEqual([]);
  });

  it('should allow multiple attachments and reactions', async () => {
    expect.assertions(2);

    const messageData = {
      roomId: new mongoose.Types.ObjectId(),
      senderId: new mongoose.Types.ObjectId(),
      attachments: ['file1.png', 'file2.jpg'],
      reactions: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
    };

    const message = new Message(messageData);
    const savedMessage = await message.save();

    expect(savedMessage.attachments).toHaveLength(2);
    expect(savedMessage.reactions).toHaveLength(2);
  });
});
