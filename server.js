const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const signup_route = require('./routes/signup');
const login_route = require('./routes/login');
const verifyjwt = require('./middlewares/verifyjwt');
const dburl = process.env.DATABASE_URL;
require('dotenv').config();

mongoose.connect(dburl);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/signup', signup_route);
app.use('/login', login_route);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/register', verifyjwt, (req, res) => {
    res.send("done");
});

// Export the app to Vercel's serverless handler
module.exports = app;
