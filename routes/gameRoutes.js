const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// Game data routes
router.post('/save-session', gameController.saveGameSession);
router.get('/sessions', gameController.getAllSessions);
router.get('/stats', gameController.getGameStats);

module.exports = router;