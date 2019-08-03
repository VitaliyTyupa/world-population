const express = require('express');
const controller = require('../controllers/countries');
const router = express.Router();

router.post('/allCountries', controller.allCountries);


module.exports = router;