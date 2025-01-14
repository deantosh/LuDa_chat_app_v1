const Room = require("../models/room");
const UnreadMessage = require("../models/unread_messages");
const sha1 = require("sha1");
const redisClient = require("../utils/redis");
const User = require("../models/user");

class UsersController {
  // Create a new user
  static async postNew(req, res) {
    const email = req.body?.email;
    const password = req.body?.password;
    const username = req.body?.username;

    if (!email) {
      return res.status(400).json({ error: "Missing email" });
    }
    if (!password) {
      return res.status(400).json({ error: "Missing password" });
    }
    if (!username) {
      return res.status(400).json({ error: "Missing username" });
    }

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Already exist" });
      }

      // Create a new user instance
      const user = await User.createDoc({
        username,
        email,
        passwordHash: sha1(password), // Hash the password
        avatar: req.body.avatar, // Optional
      });

      // Return the created user's email and ID
      return res.status(201).json({
        email: user.email,
        id: user._id.toString(),
      });
    } catch (error) {
      console.error("Error creating user:", error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get the current user based on token
  static async getMe(req, res) {
    const userToken = req.cookies.token;

    if (!userToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      // Retrieve the user ID from Redis
      const userId = await redisClient.get(userToken);

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Find the user by ID using Mongoose
      const user = await User.findById(userId, "email username isOnline status avatar");
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Return the user's email and ID
      return res.status(200).json({
        user,
      });
    } catch (error) {
      console.error("Error retrieving user:", error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get dashboard info for the current user
  static async getDashboardInfo(req, res) {
    const userToken = req.cookies.token; // Retrieve the token from cookies
    console.log("our Token", userToken);

    if (!userToken) {
      return res.status(401).json({ error: "Unauthorized 0" });
    }

    try {
      // Retrieve the user ID from Redis
      const userId = await redisClient.get(userToken);

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized 1" });
      }

      // Find the user by ID using Mongoose
      const user = await User.findOneDoc({ _id: userId });

      if (!user) {
        return res.status(401).json({ error: "Unauthorized 2" });
      }

      // Retrieve the list of rooms where the user is a member
      const rooms = await Room.findDocs({ members: user._id });

      // Retrieve unread messages for the user and convert it to a dictionary
      const unreadMessagesArray = await UnreadMessage.findDocs({
        userId: user._id,
      }).select("roomId unreadCount");
      const unreadMessages = unreadMessagesArray.reduce((acc, msg) => {
        acc[msg.roomId.toString()] = msg.unreadCount;
        return acc;
      }, {});

      // Return the dashboard info
      return res.status(200).json({
        user,
        rooms,
        unreadMessages,
      });
    } catch (error) {
      console.error("Error retrieving dashboard info:", error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Fetch All Rooms - GET /rooms
  static async getAllRooms(req, res) {
    try {
      const rooms = await Room.findDocs({});
      if (!rooms || rooms.length === 0) {
        return res.status(404).json({ message: 'No rooms found' });
      }
      res.status(200).json({ rooms });
    } catch (error) {
      res.status(500).json({ error: `Failed to fetch rooms: ${error.message}` });
    }
  }
}

// Export
module.exports = UsersController;
