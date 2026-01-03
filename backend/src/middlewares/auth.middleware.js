const jwt = require('jsonwebtoken');

exports.authGuard = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

exports.adminGuard = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Admin only' });
    }
    next();
};
