const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class AppController {
  static async getStatus(req, res) {
    try {
      const redisStatus = await redisClient.isAlive();
      const dbStatus = dbClient.isAlive();

      res.status(200).json({
        redis: redisStatus,
        db: dbStatus,
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to check service status',
        details: error.message,
      })
    }
  }
}  

module.exports = AppController;
