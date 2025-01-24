/**
 * Test: models/room.js file.
 */
const { dbClient, mongoose } = require('../../utils/db');
const Room = require('../../models/room');
const User = require('../../models/user');

describe('room model tests', () => {

  let user, room, anotherUser;

  beforeAll(async () => {
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
      email: 'user1@gmail.com',
      passwordHash: 'hashed_password',
    });

    // Create another user to add as a member
    anotherUser = await User.createDoc({
      username: 'user2',
      email: 'user22@gmail.com',
      passwordHash: 'hashed_password',
    });

    // Create room with the created user as the creator
    const roomData = {
      name: 'General',
      description: 'This is the general chat room',
      createdBy: user._id,
    };
    room = await Room.createDoc(roomData);

    console.log('User and Room created before each test');
  });

  afterAll(async () => {
    // Close the connection
    await dbClient.closeDatabase();
  });

  it('should create a new room successfully', async () => {
    expect.assertions(4);

    expect(room._id).toBeDefined();
    expect(room.name).toBe('General');
    expect(room.description).toBe('This is the general chat room');
    expect(room.createdBy.toString()).toStrictEqual(user._id.toString());
  });

  it('should throw validation error if required fields are missing', async () => {
    expect.assertions(4);

    let error;

    try {
      await Room.createDoc({});
    } catch (err) {
      error = err;
    }

    // Ensure the error is defined and is a ValidationError 
    expect(error).toBeDefined();
    expect(error instanceof mongoose.Error.ValidationError).toBe(true);

    expect(error.errors.name).toBeDefined();
    expect(error.errors.createdBy).toBeDefined();
  });

  it('should allow updating room details', async () => {
    expect.assertions(3);

    const updateData = {
      name: 'Updated Room',
      description: 'Room for updates',
    };
    const query = { createdBy: user._id };

    const updatedRoom = await Room.updateDoc(query, updateData);

    expect(updatedRoom.name).toBe('Updated Room');
    expect(updatedRoom.description).toBe('Room for updates');
    expect(updatedRoom.createdBy.toString()).toBe(user._id.toString());
  });

  it('should handle private rooms', async () => {
    expect.assertions(1);

    const roomData = {
      isPrivate: true,
    };
    const query = { createdBy: user._id };

    const updatedRoom = await Room.updateDoc(query, roomData);

    expect(updatedRoom.isPrivate).toBe(true);
  });

  it('should handle room members', async () => {
    expect.assertions(2);

    room.members.push(anotherUser._id);
    await room.save();

    const queryObj = Room.findOneDoc({ _id: room._id });
    const updatedRoom = await queryObj.populate('members');

    expect(updatedRoom.members).toHaveLength(1);
    expect(updatedRoom.members[0]._id.toString()).toBe(anotherUser._id.toString());						
  });
});
