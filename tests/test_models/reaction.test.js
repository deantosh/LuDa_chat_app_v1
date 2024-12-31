/**
 * Test: models/reaction.js file.
 */
const { dbClient } = require('../../utils/db');
const Reaction = require('../../models/reaction');
const Message = require('../../models/message');
const User = require('../../models/user');
const Room = require('../../models/room');

describe('reaction model tests', () => {
  let user, room, message, reaction;

  beforeAll(async () => {
    // Create indexes for each collection
    await Reaction.init();
    await Message.init();
    await User.init();
    await Room.init();
    console.log('Indexes created for the Reaction model');
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

    // Create a reaction for the message
    reaction = await Reaction.createDoc({
      messageId: message._id,
      userId: user._id,
      reactionType: '👍',
    });

    console.log('user, room, message, and reaction created before each test');
  });

  afterAll(async () => {
    // Close the connection
    await dbClient.closeDatabase();
  });

  it('should create a new reaction successfully', async () => {
    expect.assertions(4);

    const newReactionData = {
      messageId: message._id,
      userId: user._id,
      reactionType: '❤️',
    };
    const newReaction = await Reaction.createDoc(newReactionData);

    expect(newReaction).not.toBeNull();
    expect(newReaction.reactionType).toBe('❤️');
    expect(newReaction.messageId.toString()).toBe(message._id.toString());
    expect(newReaction.userId.toString()).toBe(user._id.toString());
  });

  it('should find a reaction by query', async () => {
    expect.assertions(4);

    const foundReaction = await Reaction.findOneDoc({ _id: reaction._id });

    expect(foundReaction).not.toBeNull();
    expect(foundReaction.reactionType).toBe('👍');
    expect(foundReaction.messageId.toString()).toBe(message._id.toString());
    expect(foundReaction.userId.toString()).toBe(user._id.toString());
  });

  it('should update a reaction and return the updated version', async () => {
    expect.assertions(2);

    const updatedReaction = await Reaction.updateDoc(
      { _id: reaction._id },
      { reactionType: '😂' }
    );

    expect(updatedReaction).not.toBeNull();
    expect(updatedReaction.reactionType).toBe('😂');
  });

  it('should delete a reaction by query', async () => {
    expect.assertions(3);

    const deletedReaction = await Reaction.deleteDoc({ _id: reaction._id });

    expect(deletedReaction).not.toBeNull();
    expect(deletedReaction.reactionType).toBe('👍');

    const reactionAfterDelete = await Reaction.findOneDoc({ _id: reaction._id });
    expect(reactionAfterDelete).toBeNull();
  });

  it('should find multiple reactions with pagination', async () => {
    expect.assertions(2);

    const reactions = await Reaction.findDocs({}, { limit: 2, skip: 0 });

    expect(reactions).toHaveLength(1);
    expect(reactions[0].reactionType).toBe('👍');
  });

  it('should throw error if reaction not found on update', async () => {
    expect.assertions(1);

    try {
      await Reaction.updateDoc({ _id: 'non-existent-id' }, { reactionType: '😢' });
    } catch (error) {
      expect(error.message).toContain('Error updating document:');
    }
  });

  it('should throw error if reaction not found on delete', async () => {
    expect.assertions(1);

    try {
      await Reaction.deleteDoc({ _id: 'non-existent-id' });
    } catch (error) {
      expect(error.message).toContain('Error deleting document:');
    }
  });
});
