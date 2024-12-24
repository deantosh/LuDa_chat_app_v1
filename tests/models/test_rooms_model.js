/* eslint-disable jest/no-hooks */

/**
 * @jest-environment node
 */

import mongoose from 'mongoose';
import Room from '../../models/room';

describe('room model tests', () => {
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

  it('should create a new room successfully', async () => {
    expect.assertions(3);

    const roomData = {
      name: 'General',
      description: 'This is the general chat room',
      isPrivate: false,
    };

    const room = new Room(roomData);
    const savedRoom = await room.save();

    expect(savedRoom._id).toBeDefined();
    expect(savedRoom.name).toStrictEqual(roomData.name);
    expect(savedRoom.description).toStrictEqual(roomData.description);
  });

  it('should throw validation error if required fields are missing', async () => {
    expect.assertions(1);

    const room = new Room({});

    await expect(room.save()).rejects.toThrow(
      'Room validation failed: name: Path `name` is required.',
    );
  });

  it('should allow updating room details', async () => {
    expect.assertions(1);

    const room = new Room({
      name: 'Updates Room',
      description: 'Room for updates',
      isPrivate: false,
    });

    const savedRoom = await room.save();
    savedRoom.name = 'Updated Room';
    const updatedRoom = await savedRoom.save();

    expect(updatedRoom.name).toStrictEqual('Updated Room');
  });

  it('should handle private rooms', async () => {
    expect.assertions(2);

    const roomData = {
      name: 'Private Room',
      description: 'This room is private',
      isPrivate: true,
    };

    const room = new Room(roomData);
    const savedRoom = await room.save();

    expect(savedRoom.isPrivate).toStrictEqual(true);
    expect(savedRoom.name).toStrictEqual(roomData.name);
  });

  it('should handle room members', async () => {
    expect.assertions(1);

    const room = new Room({
      name: 'Members Room',
      members: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
    });

    const savedRoom = await room.save();

    expect(savedRoom.members).toHaveLength(2);
  });
});
