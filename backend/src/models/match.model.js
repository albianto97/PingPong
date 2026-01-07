const mongoose = require('mongoose');

const setSchema = new mongoose.Schema(
    {
        player1Points: Number,
        player2Points: Number
    },
    { _id: false }
);

const matchSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['SINGLE', 'DOUBLE'],
            required: true
        },

        players: {
            player1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            player2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            partner1: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            partner2: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        },

        rules: {
            setsToWin: { type: Number, enum: [1, 2], required: true },
            maxPoints: { type: Number, enum: [11, 21], required: true }
        },

        sets: [setSchema],

        winner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },

        playedAt: {
            type: Date,
            default: Date.now
        },
        tournament: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tournament',
            default: null
        }, round: {
            type: Number,
            default: 1
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Match', matchSchema);
