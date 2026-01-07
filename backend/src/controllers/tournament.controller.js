const Tournament = require('../models/tournament.model');
const { nextPowerOfTwo, shuffle } = require('../utils/bracket.util');
const Match = require('../models/match.model');
const TournamentStanding = require('../models/tournamentStanding.model');



exports.getBracket = async (req, res) => {
    const tournamentId = req.params.id;

    const matches = await Match.find({ tournament: tournamentId })
        .populate('players.player1', 'username')
        .populate('players.player2', 'username')
        .sort({ round: 1, createdAt: 1 });

    const roundsMap = {};

    for (const match of matches) {
        const r = match.round || 1;
        if (!roundsMap[r]) roundsMap[r] = [];
        roundsMap[r].push(match);
    }

    const rounds = Object.keys(roundsMap).map(r => ({
        round: Number(r),
        matches: roundsMap[r]
    }));

    res.json({ rounds });
};
exports.createTournament = async (req, res) => {
    try {
        const { name, type, players, rules } = req.body;

        const tournament = await Tournament.create({
            name,
            type,
            players,
            rules,
            createdBy: req.user.id
        });

        res.status(201).json(tournament);
    } catch (err) {
        res.status(500).json({ message: 'Tournament creation failed', err });
    }
};
exports.getAllTournaments = async (req, res) => {
    try {
        const tournaments = await Tournament.find()
            .populate('players', 'username')
            .sort({ createdAt: -1 });

        res.json(tournaments);
    } catch (err) {
        res.status(500).json({ message: 'Failed to load tournaments' });
    }
};
exports.getTournamentById = async (req, res) => {
    try {
        const tournament = await Tournament.findById(req.params.id)
            .populate('players', 'username');

        res.json(tournament);
    } catch (err) {
        res.status(404).json({ message: 'Tournament not found' });
    }
};
exports.generateMatches = async (req, res) => {
    try {
        const tournament = await Tournament.findById(req.params.id);

        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }

        if (tournament.status !== 'DRAFT') {
            return res.status(400).json({ message: 'Matches already generated' });
        }

        const players = shuffle([...tournament.players]);

        let matches = [];

        if (tournament.type === 'ROUND_ROBIN') {
            // già fatto in T3.1
            for (let i = 0; i < players.length; i++) {
                for (let j = i + 1; j < players.length; j++) {
                    matches.push({
                        type: 'SINGLE',
                        players: {
                            player1: players[i],
                            player2: players[j]
                        },
                        rules: tournament.rules,
                        tournament: tournament._id,
                        sets: []
                    });
                }
            }
        }

        if (tournament.type === 'ELIMINATION') {
            const targetSize = nextPowerOfTwo(players.length);
            const byes = targetSize - players.length;

            // aggiungo bye (null = passa turno)
            for (let i = 0; i < byes; i++) {
                players.push(null);
            }

            for (let i = 0; i < players.length; i += 2) {
                if (!players[i] || !players[i + 1]) {
                    // bye automatico → match non creato
                    continue;
                }

                matches.push({
                    type: 'SINGLE',
                    players: {
                        player1: players[i],
                        player2: players[i + 1]
                    },
                    rules: tournament.rules,
                    tournament: tournament._id,
                    round: 1,
                    sets: []
                });
            }
        }

        await Match.insertMany(matches);

        tournament.status = 'ONGOING';
        await tournament.save();

        res.json({
            message: 'Matches generated',
            total: matches.length,
            type: tournament.type
        });

    } catch (err) {
        res.status(500).json({
            message: 'Failed to generate matches',
            err
        });
    }
};
exports.advanceEliminationTournament = async (tournamentId, round) => {
    // tutti i match di questo round
    const matches = await Match.find({
        tournament: tournamentId,
        round
    });

    // se almeno uno non è concluso → stop
    if (matches.some(m => !m.winner)) return;

    const winners = matches.map(m => m.winner);

    // se rimane un solo vincitore → torneo finito
    if (winners.length === 1) {
        await Tournament.findByIdAndUpdate(tournamentId, {
            status: 'COMPLETED',
            winner: winners[0]
        });
        return;
    }

    const nextRound = round + 1;
    let newMatches = [];

    for (let i = 0; i < winners.length; i += 2) {
        if (!winners[i + 1]) continue;

        newMatches.push({
            type: 'SINGLE',
            players: {
                player1: winners[i],
                player2: winners[i + 1]
            },
            tournament: tournamentId,
            round: nextRound,
            rules: matches[0].rules,
            sets: []
        });
    }

    await Match.insertMany(newMatches);
};
exports.getStandings = async (req, res) => {
    const standings = await TournamentStanding.find({
        tournament: req.params.id
    })
        .populate('player', 'username')
        .sort({
            matchesWon: -1,
            setsWon: -1,
            pointsFor: -1
        });

    res.json(standings);
};
