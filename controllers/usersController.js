const sha1 = require('sha1');
const redisClient = require('../utils/redis');
const User = require('../models/user');

class UsersController {
  // Create a new user
  static async postNew(req, res) {
    const email = req.body?.email;
    const password = req.body?.password;
    const username = req.body?.username;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }
    if (!username) {
      return res.status(400).json({ error: 'Missing username' });
    }

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Already exist' });
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
      console.error('Error creating user:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get the current user based on token
  static async getMe(req, res) {
    const userToken = req.headers['x-token'];
    if (!userToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      // Retrieve the user ID from Redis
      const key = `auth_${userToken}`;
      const userId = await redisClient.get(key);

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Find the user by ID using Mongoose
      const user = await User.findById(userId, 'email');
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Return the user's email and ID
      return res.status(200).json({
        id: user._id.toString(),
        email: user.email,
      });
    } catch (error) {
      console.error('Error retrieving user:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

// Export
module.exports = UsersController;
