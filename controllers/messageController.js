/**
 * Module defines App Message management.
 */
const Room = require('../models/room');
const Reply = require('../models/reply');
const Message = require('../models/message');
const Reaction = require('../models/reaction');

class MessageController {
  // Send Message - POST /rooms/:room_id/messages
  static async sendMessage(req, res) {
    const { room_id } = req.params;
    const { senderId, text, attachments } = req.body;

    try {
      if (!senderId) {
        return res.status(400).json({ error: 'Sender ID is required' });
      }
      if (!text && (!attachments || attachments.length === 0)) {
        return res.status(400).json({ error: 'Message must contain text or attachments' });
      }

      const room = await Room.findOneDoc({ _id: room_id });
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      const message = await Message.createDoc({
        roomId: room_id,
        senderId,
        text,
        attachments,
      });

      // Increment unread message count for other users in the room (excluding sender)
      const usersInRoom = await Room.findOneDoc({ _id: room_id }).populate('users'); // Assuming your Room model has a 'users' field
      const bulkOps = usersInRoom[0].users
        .filter(user => user._id.toString() !== senderId.toString()) // Exclude sender from unread messages
        .map(user => ({
          updateOne: {
          filter: { roomId: room_id, userId: user._id },
          update: { $inc: { unreadCount: 1 } },
          upsert: true
        }
      }));

      // Perform bulk operation to update unread counts
      if (bulkOps.length > 0) {
        await UnreadMessage.bulkWrite(bulkOps);
      }
      res.status(201).json({ message: 'Message sent successfully', messageData: message });
    } catch (error) {
      res.status(500).json({ error: `Failed to send message: ${error.message}` });
    }
  }

  // Retrieve Messages - GET /rooms/:room_id/messages
  static async getMessages(req, res) {
    const { room_id } = req.params;

    try {
      const room = await Room.findOneDoc({ _id: room_id });
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      const messages = await Message.findDocs({ roomId: room_id })
        .populate('senderId', 'username') // populate sender info
        .populate({
          path: 'replies',
          populate: { path: 'senderId', select: 'username' }, // populate replies' sender info
        })
        .populate({
          path: 'reactions',
          populate: { path: 'userId', select: 'name' }, // populate reactions' user info
        })
        .exec();

      res.status(200).json({ messages });
    } catch (error) {
      res.status(500).json({ error: `Failed to retrieve messages: ${error.message}` });
    }
  }

  // Reply to a Message - POST /rooms/:room_id/messages/:message_id/replies
  static async replyToMessage(req, res) {
    const { room_id, message_id } = req.params;
    const { senderId, text, attachments } = req.body;

    try {
      const room = await Room.findOneDoc({ _id: room_id });
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      const message = await Message.findOneDoc({ _id: message_id });
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }

      const reply = await Reply.createDoc({
        messageId: message_id,
        senderId,
        text,
        attachments,
      });

      // Add the reply to the message's replies
      message.replies.push(reply._id);
      await message.save();

      res.status(201).json({ message: 'Reply added successfully', reply });
    } catch (error) {
      res.status(500).json({ error: `Failed to reply to message: ${error.message}` });
    }
  }

  // Fetch Replies from Message - GET /messages/:message_id/replies
  static async getReplies(req, res) {
    const { message_id } = req.params;

    try {
      const message = await Message.findOneDoc({ _id: message_id });
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }

      const replies = await Reply.findDocs({ messageId: message_id })
        .populate('senderId', 'name') // populate reply sender info
        .populate({
          path: 'reactions',
          populate: { path: 'userId', select: 'name' }, // populate reactions' user info
        })
        .exec();

      res.status(200).json({ replies });
    } catch (error) {
      res.status(500).json({ error: `Failed to fetch replies: ${error.message}` });
    }
  }

  // Add Reaction to Message - POST /rooms/:room_id/messages/:message_id/reactions
  static async addReaction(req, res) {
    const { room_id, message_id } = req.params;
    const { userId, reactionType } = req.body;

    try {
      const room = await Room.findOneDoc({ _id: room_id });
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      const message = await Message.findOneDoc({ _id: message_id });
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }

      const reaction = await Reaction.createDoc({
        messageId: message_id,
        userId,
        reactionType,
      });

      // Add reaction to the message
      message.reactions.push(reaction._id);
      await message.save();

      res.status(201).json({ message: 'Reaction added successfully', reaction });
    } catch (error) {
      res.status(500).json({ error: `Failed to add reaction: ${error.message}` });
    }
  }
}

// Export
module.exports = MessageController;
