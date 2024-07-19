const express = require('express');
const router = express.Router();
const { getTopics, postTopic} = require('../controllers/topics.controllers');

router.get('/topics', getTopics);
router.post('/topics', postTopic)

module.exports = router;