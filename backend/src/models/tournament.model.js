const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: {
        type: String,
        enum: ['ROUND_ROBIN', 'ELIMINATION'],
        required: true
    },
    status: {
        type: String,
        enum: ['DRAFT', 'ONGOING', 'COMPLETED'],
        default: 'DRAFT'
    },
    players: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    rules: {
        maxPoints: { type: Number, default: 11 },
        setsToWin: { type: Number, default: 1 }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Tournament', tournamentSchema);
