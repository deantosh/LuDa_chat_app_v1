const { v4: uuidv4 } = require("uuid");
const sha1 = require("sha1");
const redisClient = require("../utils/redis");
const User = require("../models/user");

class AuthController {
  static async getConnect(req, res) {
    // Get Authorization header and verify it's not empty and is of Basic type
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Basic")) {
      return res
        .status(401)
        .json({ error: "Missing or Invalid Authorization header" });
    }

    // Get authHeader value
    const base64Credentials = authHeader.split(" ")[1];

    // Decode Base64 Header value to <email>:<password>
    const decodedCredentials = Buffer.from(
      base64Credentials,
      "base64"
    ).toString("utf-8");

    // Get email and password values
    const [email, password] = decodedCredentials.split(":");

    // Find user using email
    let user;
    try {
      user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Hash password and check if correct
    const hashedPassword = sha1(password);
    if (user.passwordHash !== hashedPassword) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Create user token
    const token = uuidv4();

    // Create key
    const authToken = `auth_${token}`;

    // Store key in Redis
    try {
      await redisClient.set(authToken, user._id.toString(), 24 * 60 * 60); // TTL: 24 hours

      // Store the token in a cookie with HttpOnly and Secure flags
      res.cookie("token", authToken, {
        httpOnly: true, // Cannot be accessed by JavaScript on the client side
        secure: false,
        maxAge: 24 * 60 * 60 * 1000, // Cookie expires in 24 hours
        sameSite: "Lax", // CSRF protection
      });
      return res.status(200).json({ token });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getDisconnect(req, res) {
    // Get user token
    const userToken = req.cookies.token;
    if (!userToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const userId = await redisClient.get(userToken);
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Delete token
      await redisClient.del(userToken);
      return res.status(204).json({});
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

// Export
module.exports = AuthController;
