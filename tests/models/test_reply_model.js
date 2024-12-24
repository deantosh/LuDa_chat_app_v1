/* eslint-disable jest/no-hooks */

/**
 * @jest-environment node
 */

import mongoose from 'mongoose';
import Reply from '../../models/reply';

describe('reply model tests', () => {
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

  it('should create a new reply successfully', async () => {
    expect.assertions(5);

    const replyData = {
      messageId: new mongoose.Types.ObjectId(),
      senderId: new mongoose.Types.ObjectId(),
      text: 'This is a reply',
      attachments: ['attachment1.png'],
    };

    const reply = new Reply(replyData);
    const savedReply = await reply.save();

    expect(savedReply._id).toBeDefined();
    expect(savedReply.messageId.toString()).toStrictEqual(replyData.messageId.toString());
    expect(savedReply.senderId.toString()).toStrictEqual(replyData.senderId.toString());
    expect(savedReply.text).toStrictEqual(replyData.text);
    expect(savedReply.attachments).toStrictEqual(replyData.attachments);
  });

  it('should throw validation error if required fields are missing', async () => {
    expect.assertions(2);

    const reply = new Reply({});
    let error;

    try {
      await reply.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.messageId).toBeDefined();
  });

  it('should handle optional fields correctly', async () => {
    expect.assertions(4);

    const replyData = {
      messageId: new mongoose.Types.ObjectId(),
      senderId: new mongoose.Types.ObjectId(),
    };

    const reply = new Reply(replyData);
    const savedReply = await reply.save();

    expect(savedReply._id).toBeDefined();
    expect(savedReply.text).toBeUndefined();
    expect(savedReply.attachments).toStrictEqual([]);
    expect(savedReply.parentReplyId).toBeNull();
  });

  it('should allow multiple attachments and reactions', async () => {
    expect.assertions(2);

    const replyData = {
      messageId: new mongoose.Types.ObjectId(),
      senderId: new mongoose.Types.ObjectId(),
      attachments: ['file1.png', 'file2.jpg'],
      reactions: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
    };

    const reply = new Reply(replyData);
    const savedReply = await reply.save();

    expect(savedReply.attachments).toHaveLength(2);
    expect(savedReply.reactions).toHaveLength(2);
  });
});
