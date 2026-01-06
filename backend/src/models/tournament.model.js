const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
    name: String,
    type: { type: String, enum: ['SINGLE', 'DOUBLE'], default: 'SINGLE' },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Match' }],
    status: { type: String, enum: ['PENDING', 'ONGOING', 'FINISHED'], default: 'PENDING' },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Tournament', tournamentSchema);
