const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const matchRoutes = require('./routes/match.routes');


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);


app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

module.exports = app;
