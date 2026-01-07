const Match = require('../models/match.model');
const User = require('../models/user.model');
const { calculateElo } = require('../services/elo.service');
const validateSet = require('../utils/validateSet');



exports.createMatch = async (req, res) => {
    try {
        const { type, players, rules, sets } = req.body;

        const validSets = [];
        let p1Sets = 0;
        let p2Sets = 0;

        for (const set of sets) {
            if (!validateSet(set, rules)) {
                return res.status(400).json({ message: 'Punteggio set non valido' });
            }

            validSets.push(set);

            if (set.player1Points > set.player2Points) p1Sets++;
            else p2Sets++;

            if (p1Sets === rules.setsToWin || p2Sets === rules.setsToWin) {
                break;
            }
        }

        // ❗ controllo finale: il match deve essere deciso
        if (p1Sets !== rules.setsToWin && p2Sets !== rules.setsToWin) {
            return res.status(400).json({ message: 'Match incompleto' });
        }



        const winner =
            p1Sets > p2Sets ? players.player1 : players.player2;

        const match = await Match.create({
          type,
          players,
          rules,
          sets: validSets,
          winner
        });


        // ELO & stats (singolo)
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

            // 🔴 QUESTO BLOCCO QUI (CORRETTO)
            for (const set of sets) {
                user1.stats.pointsFor += set.player1Points;
                user1.stats.pointsAgainst += set.player2Points;

                user2.stats.pointsFor += set.player2Points;
                user2.stats.pointsAgainst += set.player1Points;

                if (set.player1Points > set.player2Points) {
                    user1.stats.setsWon++;
                    user2.stats.setsLost++;
                } else {
                    user2.stats.setsWon++;
                    user1.stats.setsLost++;
                }
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

// GET /matches?page=1&limit=10
exports.getAllMatches = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [matches, total] = await Promise.all([
            Match.find()
                .populate('players.player1', 'username')
                .populate('players.player2', 'username')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Match.countDocuments()
        ]);

        res.json({
            matches,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch matches', err });
    }
};

exports.getMatchesByPlayer = async (req, res) => {
    try {
        const { playerId } = req.params;

        const matches = await Match.find({
            $or: [
                { 'players.player1': playerId },
                { 'players.player2': playerId }
            ]
        })
            .populate('players.player1', 'username')
            .populate('players.player2', 'username')
            .sort({ createdAt: -1 });

        res.json(matches);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch player matches',
            error
        });
    }
};

exports.getHeadToHead = async (req, res) => {
    try {
        const { playerA, playerB } = req.params;

        const matches = await Match.find({
            $or: [
                { 'players.player1': playerA, 'players.player2': playerB },
                { 'players.player1': playerB, 'players.player2': playerA }
            ]
        });

        const stats = {
            total: matches.length,
            winsA: 0,
            winsB: 0,
            setsA: 0,
            setsB: 0,
            pointsA: 0,
            pointsB: 0,
            lastMatch: null
        };

        for (const m of matches) {
            let setsA = 0;
            let setsB = 0;

            const aIsP1 = m.players.player1.toString() === playerA;

            for (const s of m.sets) {
                const aPoints = aIsP1 ? s.player1Points : s.player2Points;
                const bPoints = aIsP1 ? s.player2Points : s.player1Points;

                stats.pointsA += aPoints;
                stats.pointsB += bPoints;

                if (aPoints > bPoints) setsA++;
                else setsB++;
            }

            stats.setsA += setsA;
            stats.setsB += setsB;

            if (setsA > setsB) stats.winsA++;
            else stats.winsB++;

            if (!stats.lastMatch || m.createdAt > stats.lastMatch.createdAt) {
                stats.lastMatch = m;
            }
        }

        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: 'Head to head failed', err });
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




