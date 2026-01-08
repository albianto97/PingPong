const express = require('express');
const router = express.Router();
const controller = require('../controllers/tournament.controller');
const { authGuard } = require('../middlewares/auth.middleware');

router.post('/', authGuard, controller.createTournament);
router.get('/', authGuard, controller.getAllTournaments);
router.get('/:id', authGuard, controller.getTournamentById);
router.get('/:id/bracket', authGuard, controller.getBracket);
router.post('/:id/generate-matches', authGuard, controller.generateMatches);
router.get('/:id/standings', authGuard, controller.getStandings);


module.exports = router;




module.exports = router;
