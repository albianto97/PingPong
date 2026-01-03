const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['USER', 'ADMIN'],
            default: 'USER'
        },

        // Ranking
        eloRating: {
            type: Number,
            default: 1000
        },

        // Statistiche aggregate persistite
        stats: {
            matchesPlayed: { type: Number, default: 0 },
            wins: { type: Number, default: 0 },
            losses: { type: Number, default: 0 },
            setsWon: { type: Number, default: 0 },
            setsLost: { type: Number, default: 0 },
            pointsFor: { type: Number, default: 0 },
            pointsAgainst: { type: Number, default: 0 }
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
