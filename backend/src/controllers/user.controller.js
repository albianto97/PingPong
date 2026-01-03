const User = require('../models/user.model');

// PROFILO PRIVATO (utente loggato)
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch profile', error });
    }
};

// PROFILO PUBBLICO
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -email');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user', error });
    }
};

// CLASSIFICA ELO
exports.getRanking = async (req, res) => {
    try {
        const users = await User.find()
            .select('username eloRating stats')
            .sort({ eloRating: -1 });

        const ranking = users.map((user, index) => ({
            position: index + 1,
            id: user._id,
            username: user.username,
            eloRating: user.eloRating,
            stats: user.stats,
            isMe: user._id.toString() === req.user.id
        }));

        res.json(ranking);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch ranking', error });
    }
};
