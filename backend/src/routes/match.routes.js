const express = require('express');
const router = express.Router();

const matchController = require('../controllers/match.controller');
const { authGuard } = require('../middlewares/auth.middleware');

router.post('/', authGuard, matchController.createMatch);
router.get('/me', authGuard, matchController.getMyMatches);
router.get('/last', authGuard, matchController.getLastMatches);
router.get('/head-to-head/:playerA/:playerB', authGuard, matchController.getHeadToHead);



module.exports = router;
