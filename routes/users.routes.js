const express = require('express');
const router = express.Router();
const { getUsers, getUserByUsername } = require('../controllers/users.controllers');

router.get('/users', getUsers);
router.get('/users/:username', getUserByUsername)

module.exports = router;