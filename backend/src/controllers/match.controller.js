const Match = require('../models/match.model');
const User = require('../models/user.model');
const { calculateElo } = require('../services/elo.service');

exports = function validateSet(set, rules) {
    const { player1Points, player2Points } = set;
    const { maxPoints } = rules;

    // numeri validi
    if (
        typeof player1Points !== 'number' ||
        typeof player2Points !== 'number'
    ) return false;

    // no pareggi
    if (player1Points === player2Points) return false;

    const max = Math.max(player1Points, player2Points);
    const min = Math.min(player1Points, player2Points);

    // non può vincere senza arrivare al punteggio minimo
    if (max < maxPoints) return false;

    // scarto minimo 2
    if (max - min < 2) return false;

    // NON può chiudere prima del massimo
    if (max === maxPoints && min > maxPoints - 2) return false;

    return true;
};


exports.createMatch = async (req, res) => {
    try {
        const { type, players, rules, sets } = req.body;

        let p1Sets = 0;
        let p2Sets = 0;

        for (const set of sets) {
            if (!validateSet(set, rules)) {
                return res.status(400).json({
                    message: 'Punteggio set non valido'
                });
            }

            if (set.player1Points > set.player2Points) p1Sets++;
            else p2Sets++;
        }

        const winner =
            p1Sets > p2Sets ? players.player1 : players.player2;

        const match = await Match.create({
            type,
            players,
            rules,
            sets,
            winner
        });

        // ELO & stats (singolo)
        if (type === 'SINGLE') {
            const user1 = await User.findById(players.player1);
            const user2 = await User.findById(players.player2);

            const resultA =
                winner.toString() === user1._id.toString() ? 1 : 0;

            const { newRatingA, newRatingB } = calculateElo(
                user1.eloRating,
                user2.eloRating,
                resultA
            );

            user1.eloRating = newRatingA;
            user2.eloRating = newRatingB;

            user1.stats.matchesPlayed++;
            user2.stats.matchesPlayed++;

            if (resultA) {
                user1.stats.wins++;
                user2.stats.losses++;
            } else {
                user2.stats.wins++;
                user1.stats.losses++;
            }

            await user1.save();
            await user2.save();
        }

        res.status(201).json(match);
    } catch (err) {
        res.status(500).json({
            message: 'Match creation failed',
            error: err
        });
    }
};
// STORICO MATCH UTENTE
exports.getMyMatches = async (req, res) => {
    try {
        const userId = req.user.id;

        const matches = await Match.find({
            $or: [
                { 'players.player1': userId },
                { 'players.player2': userId },
                { 'players.partner1': userId },
                { 'players.partner2': userId }
            ]
        })
            .populate('players.player1', 'username')
            .populate('players.player2', 'username')
            .sort({ playedAt: -1 });

        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch match history', error });
    }
};
// ULTIMI MATCH (dashboard)
exports.getLastMatches = async (req, res) => {
    try {
        const userId = req.user.id;
        const limit = parseInt(req.query.limit) || 5;

        const matches = await Match.find({
            $or: [
                { 'players.player1': userId },
                { 'players.player2': userId }
            ]
        })
            .populate('players.player1', 'username')
            .populate('players.player2', 'username')
            .sort({ playedAt: -1 })
            .limit(limit);

        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch last matches', error });
    }
};

// HEAD TO HEAD
exports.getHeadToHead = async (req, res) => {
    try {
        const { userA, userB } = req.params;

        const matches = await Match.find({
            type: 'SINGLE',
            $or: [
                {
                    'players.player1': userA,
                    'players.player2': userB
                },
                {
                    'players.player1': userB,
                    'players.player2': userA
                }
            ]
        })
            .sort({ createdAt: -1 })
            .populate('players.player1', 'username')
            .populate('players.player2', 'username')
            .populate('winner', 'username');

        res.json(matches);
    } catch (err) {
        res.status(500).json({ message: 'Head to head error' });
    }
};

exports.getAllMatches = async (req, res) => {
    try {
        const matches = await Match.find()
            .sort({ createdAt: -1 })
            .populate('players.player1', 'username')
            .populate('players.player2', 'username')
            .populate('winner', 'username');

        res.json(matches);
    } catch (err) {
        res.status(500).json({ message: 'Cannot load matches' });
    }
};

exports.getMatchesByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const matches = await Match.find({
            $or: [
                { 'players.player1': userId },
                { 'players.player2': userId }
            ]
        })
            .sort({ createdAt: -1 })
            .populate('players.player1', 'username')
            .populate('players.player2', 'username')
            .populate('winner', 'username');

        res.json(matches);
    } catch (err) {
        res.status(500).json({ message: 'Cannot load user matches' });
    }
};




