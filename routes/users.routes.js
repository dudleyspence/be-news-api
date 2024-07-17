const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/users.controllers');

router.get('/users', getUsers);

module.exports = router;