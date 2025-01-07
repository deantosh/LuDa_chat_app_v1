const { Router } = require('express');
const AppController = require('../controllers/appController');
const UsersController = require('../controllers/usersController');
const AuthController = require('../controllers/authController');
const MessageController = require('../controllers/messageController');
const RoomController = require('../controllers/roomController');

const router = Router()

// Define app routes
router.get('/status', AppController.getStatus);

// User Management
router.post('/users/register', UsersController.postNew);
router.get('/users/me', UsersController.getMe);
router.get('/users/dashboard', UsersController.getDashboardInfo);

// Auth Management
router.post('/users/login', AuthController.getConnect);
router.delete('users/logout', AuthController.getDisconnect);

// Mesage Management: including replies and reactions
router.post('/rooms/:room_id/messages', MessageController.sendMessage);
router.get('/rooms/:room_id/messages', MessageController.getMessages);
router.post('/rooms/:room_id/messages/:message_id/replies', MessageController.replyToMessage);
router.get('/messages/:message_id/replies', MessageController.getReplies);
router.post('/rooms/:room_id/messages/:message_id/reactions', MessageController.addReaction);

// Room Management
router.post('/rooms', RoomController.createRoom);
router.post('/rooms/:room_id/users/:user_id/join', RoomController.joinRoom);
router.delete('/rooms/:room_id/users/:user_id/exit', RoomController.exitRoom);

// Export router
module.exports = router;
