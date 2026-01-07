const mongoose = require('mongoose');

const TournamentStandingSchema = new mongoose.Schema({
    tournament: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tournament',
        required: true
    },
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    matchesPlayed: { type: Number, default: 0 },
    matchesWon: { type: Number, default: 0 },
    matchesLost: { type: Number, default: 0 },

    setsWon: { type: Number, default: 0 },
    setsLost: { type: Number, default: 0 },

    pointsFor: { type: Number, default: 0 },
    pointsAgainst: { type: Number, default: 0 }

}, { timestamps: true });

module.exports = mongoose.model(
    'TournamentStanding',
    TournamentStandingSchema
);
