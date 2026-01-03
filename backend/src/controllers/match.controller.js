const Match = require('../models/match.model');
const User = require('../models/user.model');
const { calculateElo } = require('../services/elo.service');

const validateSet = (set, rules) => {
    const { player1Points, player2Points } = set;
    const max = rules.maxPoints;

    const maxScore = Math.max(player1Points, player2Points);
    const diff = Math.abs(player1Points - player2Points);

    if (maxScore < max) return false;
    if (diff < 2) return false;

    return true;
};

exports.createMatch = async (req, res) => {
    try {
        const { type, players, rules, sets } = req.body;

        let p1Sets = 0;
        let p2Sets = 0;

        for (const set of sets) {
            if (!validateSet(set, rules)) {
                return res.status(400).json({ message: 'Invalid set score' });
            }

            if (set.player1Points > set.player2Points) p1Sets++;
            else p2Sets++;

            if (p1Sets === rules.setsToWin || p2Sets === rules.setsToWin) break;
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

        // Aggiornamento stats & ELO (solo singolo)
        if (type === 'SINGLE') {
            const user1 = await User.findById(players.player1);
            const user2 = await User.findById(players.player2);

            const resultA = winner.toString() === user1._id.toString() ? 1 : 0;

            const { newRatingA, newRatingB } = calculateElo(
                user1.eloRating,
                user2.eloRating,
                resultA
            );

            user1.eloRating = newRatingA;
            user2.eloRating = newRatingB;

            user1.stats.matchesPlayed++;
            user2.stats.matchesPlayed++;

            if (resultA === 1) {
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
    } catch (error) {
        res.status(500).json({ message: 'Match creation failed', error });
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
        const { playerA, playerB } = req.params;

        const matches = await Match.find({
            type: 'SINGLE',
            $or: [
                {
                    'players.player1': playerA,
                    'players.player2': playerB
                },
                {
                    'players.player1': playerB,
                    'players.player2': playerA
                }
            ]
        }).sort({ playedAt: -1 });

        let stats = {
            totalMatches: matches.length,
            playerAWins: 0,
            playerBWins: 0,
            setsA: 0,
            setsB: 0,
            lastMatches: []
        };

        matches.forEach((match) => {
            const winner = match.winner.toString();

            if (winner === playerA) stats.playerAWins++;
            if (winner === playerB) stats.playerBWins++;

            match.sets.forEach((set) => {
                if (set.player1Points > set.player2Points) {
                    match.players.player1.toString() === playerA
                        ? stats.setsA++
                        : stats.setsB++;
                } else {
                    match.players.player2.toString() === playerA
                        ? stats.setsA++
                        : stats.setsB++;
                }
            });
        });

        stats.lastMatches = matches.slice(0, 5);

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch head-to-head', error });
    }
};

