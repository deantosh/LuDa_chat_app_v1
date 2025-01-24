/**
 * Test: models/reply.js file.
 */
const { dbClient } = require('../../utils/db');
const Reply = require('../../models/reply');
const Message = require('../../models/message');
const Room = require('../../models/room');
const User = require('../../models/user');

describe('reply model tests', () => {
  let user, room, message, reply;

  beforeAll(async () => {
    // Create indexes for each collection
    await Reply.init();
    await Message.init();
    await User.init();
    await Room.init();
    console.log('Indexes created for the Reply model');
  });

  beforeEach(async () => {
    const connection = dbClient.getDatabase();
    await connection.db.dropDatabase();
    // Create a user
    user = await User.createDoc({
      username: 'user1',
      email: 'user@gmail.com',
      passwordHash: 'hashed_password',
    });

    // Create a room
    room = await Room.createDoc({
      name: 'General',
      description: 'This is the general chat room',
      createdBy: user._id,
    });

    // Create a message in the room
    message = await Message.createDoc({
      roomId: room._id,
      senderId: user._id,
      text: 'This is a message in the room.',
    });

    // Create a reply to the message
    reply = await Reply.createDoc({
      messageId: message._id,
      senderId: user._id,
      text: 'This is a reply to the message.',
    });

    console.log('user, room, message, and reply created before each test');
  });

  afterAll(async () => {
    // Close the connection
    await dbClient.closeDatabase();
  });

  it('should create a new reply successfully', async () => {
    expect.assertions(4);

    const newReplyData = {
      messageId: message._id,
      senderId: user._id,
      text: 'This is another reply.',
    };
    const newReply = await Reply.createDoc(newReplyData);

    expect(newReply).not.toBeNull();
    expect(newReply.text).toBe('This is another reply.');
    expect(newReply.messageId.toString()).toBe(message._id.toString());
    expect(newReply.senderId.toString()).toBe(user._id.toString());
  });

  it('should find a reply by query', async () => {
    expect.assertions(4);

    const foundReply = await Reply.findOneDoc({ _id: reply._id });

    expect(foundReply).not.toBeNull();
    expect(foundReply.text).toBe('This is a reply to the message.');
    expect(foundReply.messageId.toString()).toBe(message._id.toString());
    expect(foundReply.senderId.toString()).toBe(user._id.toString());
  });

  it('should update a reply and return the updated version', async () => {
    expect.assertions(2); // Expect 2 assertions in this test

    const updatedReply = await Reply.updateDoc(
      { _id: reply._id },
      { text: 'Updated reply text' }
    );

    expect(updatedReply).not.toBeNull();
    expect(updatedReply.text).toBe('Updated reply text');
  });

  it('should delete a reply by query', async () => {
    expect.assertions(3);

    const deletedReply = await Reply.deleteDoc({ _id: reply._id });

    expect(deletedReply).not.toBeNull();
    expect(deletedReply.text).toBe('This is a reply to the message.');

    const replyAfterDelete = await Reply.findOneDoc({ _id: reply._id });
    expect(replyAfterDelete).toBeNull();
  });

  it('should find multiple replies with pagination', async () => {
    expect.assertions(2);

    const replies = await Reply.findDocs({}, { limit: 2, skip: 0 });

    expect(replies).toHaveLength(1);
    expect(replies[0].text).toBe('This is a reply to the message.');
  });

  it('should throw error if reply not found on update', async () => {
    expect.assertions(1);

    try {
      await Reply.updateDoc({ _id: 'non-existent-id' }, { text: 'Some new text' });
    } catch (error) {
      expect(error.message).toContain('Error updating document:');
    }
  });

  it('should throw error if reply not found on delete', async () => {
    expect.assertions(1);

    try {
      await Reply.deleteDoc({ _id: 'non-existent-id' });
    } catch (error) {
      expect(error.message).toContain('Error deleting document:');
    }
  });
});
