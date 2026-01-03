const express = require('express');
const router = express.Router();

const matchController = require('../controllers/match.controller');
const { authGuard } = require('../middlewares/auth.middleware');

router.post('/', authGuard, matchController.createMatch);

module.exports = router;
