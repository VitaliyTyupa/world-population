const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const countriesRoutes = require('./routes/countries');
const keys = require('./config/keys');

const app = express();

mongoose.connect(keys.mongoURL,  { useNewUrlParser: true })
    .then(() => console.log('connect from mongoose'))
    .catch(error => console.log(error));

app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/countries', countriesRoutes);

module.exports = app;