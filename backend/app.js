const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const keys = require('./config/keys');

const app = express();

mongoose.connect(keys.mongoURL)
    .then(() => console.log('connect from mongoose'))
    .catch(error => console.log(error));


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use('/api/auth', authRoutes);

module.exports = app;