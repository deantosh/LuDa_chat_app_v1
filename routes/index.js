const { Router } = require('express');
const AppController = require('../controllers/appController');

const router = Router()

// Define app routes
router.get('/status', AppController.getStatus);

// Export router
module.exports = router;
