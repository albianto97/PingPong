const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const { authGuard } = require('../middlewares/auth.middleware');

// profilo privato
router.get('/me', authGuard, userController.getMe);

// classifica
router.get('/ranking', authGuard, userController.getRanking);

// profilo pubblico
router.get('/:id', authGuard, userController.getUserById);

module.exports = router;
