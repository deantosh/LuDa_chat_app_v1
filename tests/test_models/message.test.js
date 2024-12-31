/**
 * Tests: models/message.js file.
 */
const { dbClient } = require('../../utils/db');
const Message = require('../../models/message');
const Room = require('../../models/room');
const User = require('../../models/user');

describe('message model tests', () => {
  let user, room, message;

  beforeAll(async () => {
    // Create indexes for each collection
    await Message.init();
    await User.init();
    await Room.init();
    console.log('Indexes created for the User model');
  });

  beforeEach(async () => {
    const connection = dbClient.getDatabase();
    await connection.db.dropDatabase();
    // Create user
    user = await User.createDoc({
      username: 'user1',
      email: 'user@gmail.com',
      passwordHash: 'hashed_password',
    });

    // Create room with the created user as the creator 
    const roomData = {
      name: 'General',
      description: 'This is the general chat room',
      createdBy: user._id,
    };
    room = await Room.createDoc(roomData);

    // Create a message sent by user to the room 
    message = await Message.createDoc({
      roomId: room._id,
      senderId: user._id,
      text: 'Hello everyone, thank you for adding me to this room.',
    });

    console.log('user, room and message created before each test');
  });

  afterAll(async () => {
    // Close the connection                                               
    await dbClient.closeDatabase();
  });

  it('should create a new message successfully', async () => {
    expect.assertions(4);

    const newMessageData = {
      roomId: room._id,
      senderId: user._id,
      text: 'New message in the room',
    };
    const newMessage = await Message.createDoc(newMessageData);

    expect(newMessage).not.toBeNull();
    expect(newMessage.text).toBe('New message in the room');
    expect(newMessage.roomId.toString()).toBe(room._id.toString());
    expect(newMessage.senderId.toString()).toBe(user._id.toString());
  });

  it('should find a message by query', async () => {
    expect.assertions(4);

    const foundMessage = await Message.findOneDoc({ _id: message._id });

    expect(foundMessage).not.toBeNull();
    expect(foundMessage.text).toBe('Hello everyone, thank you for adding me to this room.');
    expect(foundMessage.senderId.toString()).toBe(user._id.toString());
    expect(foundMessage.roomId.toString()).toBe(room._id.toString());
  });

  it('should update a message and return the updated version', async () => {
    expect.assertions(2);

    const updatedMessage = await Message.updateDoc(
      { _id: message._id },
      { text: 'Updated message text' }
    );

    expect(updatedMessage).not.toBeNull();
    expect(updatedMessage.text).toBe('Updated message text');
  });

  it('should delete a message by query', async () => {
    expect.assertions(3);

    const deletedMessage = await Message.deleteDoc({ _id: message._id });

    expect(deletedMessage).not.toBeNull();
    expect(deletedMessage.text).toBe('Hello everyone, thank you for adding me to this room.');

    const messageAfterDelete = await Message.findOneDoc({ _id: message._id });
    expect(messageAfterDelete).toBeNull();
  });

  it('should find multiple messages with pagination', async () => {
    expect.assertions(2);

    const messages = await Message.findDocs({}, { limit: 2, skip: 0 });

    expect(messages).toHaveLength(1);
    expect(messages[0].text).toBe('Hello everyone, thank you for adding me to this room.');
  });

  it('should throw error if message not found on update', async () => {
    expect.assertions(1);

    try {
      await Message.updateDoc({ _id: 'non-existent-id' }, { text: 'Some new text' });
    } catch (error) {
      expect(error.message).toContain('Error updating document:');
    }
  });

  it('should throw error if message not found on delete', async () => {
    expect.assertions(1);

    try {
      await Message.deleteDoc({ _id: 'non-existent-id' });
    } catch (error) {
      expect(error.message).toContain('Error deleting document:');
    }
  });
});
