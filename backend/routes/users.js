const express = require('express');
const controller = require('../controllers/users');
const router = express.Router();

router.post('/allUsers', controller.allUsers);


module.exports = router;