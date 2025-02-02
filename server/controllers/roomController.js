/**
 * Module defines room controller.
 * Contains methods to create, join, and exit chat rooms.
 */
const Room = require('../models/room');
const User = require('../models/user');
const { ObjectId } = require('mongodb');

class RoomController {
  // Create Room - POST /rooms
  static async createRoom(req, res) {
    try {
      // Validate request body
      if (!req.body.name) {
        return res.status(400).json({ error: 'Name is required' });
      }
      if (!req.body.createdBy) {
        return res.status(400).json({ error: 'createdBy is required' });
      }

      // Destructure only after validation
      const { name, description, isPrivate, createdBy, members } = req.body;

      // Validate that `createdBy` is a valid User
      const user = await User.findOneDoc({ _id: createdBy });
      if (!user) {
        return res.status(404).json({ error: 'Creator user not found' });
      }

      // Create room
      const room = await Room.createDoc({
        name,
        description,
        isPrivate,
        createdBy,
        members,
      });
      res.status(201).json({ message: 'Room created successfully', room });
    } catch (error) {
      res.status(500).json({ error: `Failed to create room: ${error.message}` });
    }
  }

  // View all rooms - GET /rooms
  static async viewAllRooms(req, res) {
    try {
      const rooms = await Room.findDocs();
      if (rooms.length === 0) {
        return res.status(404).json({ error: 'No rooms found'});
      }
      return res.status(200).json({ rooms }); // Return all rooms
    } catch (error) {
      return res.status(500).json({ error: `Error fetching rooms: ${error.message}` });
    }
  }

  // View specified room - GET /rooms/:room_id
  static async viewRoom(req, res) {
    const room_id = req.params.room_id;

    try {
      const room = await Room.findOneDoc({
        _id: room_id,
      }).populate('createdBy', 'username email');
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      return res.status(200).json({ room }); // Return room
    } catch (error) {
      return res.status(500).json({ error: `Error fetching room: ${error.message}` });
    }
  }

  // Join Room - POST /rooms/:room_id/users/:user_id/join
  static async joinRoom(req, res) {
    const { room_id, user_id } = req.params;

    try {
      const room = await Room.findOneDoc({ _id: room_id });
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      const user = await User.findOneDoc({ _id: user_id });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Reset unread messages
      // const unreadMessages = await UnreadMessage.findOneDoc({ roomId: room._id, userId: user._id });
      // if (unreadMessages) {
       // unreadMessages.unreadCount = 0;  // Reset unread messages
        // await unreadMessages.save();
     //  }
      // Add user to the room's members if not already present
      if (!room.members.includes(user._id)) {
        room.members.push(user._id);
        await room.save();
      }

      res.status(200).json({ message: 'User joined the room successfully', room });
    } catch (error) {
      res.status(500).json({ error: `Failed to join room: ${error.message}` });
    }
  }

  // Exit Room - POST /rooms/:room_id/users/:user_id/exit
  static async exitRoom(req, res) {
    const { room_id, user_id } = req.params;

    try {
      const room = await Room.findOneDoc({ _id: room_id });
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      // Remove user from the room's members
      const userIndex = room.members.indexOf(user_id);
      if (userIndex !== -1) {
        room.members.splice(userIndex, 1);
        room.save();
      } else {
        return res.status(400).json({ error: 'User is not a member of the room' });
      }

      res.status(200).json({ message: 'User exited the room successfully', room });
    } catch (error) {
      res.status(500).json({ error: `Failed to exit room: ${error.message}` });
    }
  }
}

module.exports = RoomController;
