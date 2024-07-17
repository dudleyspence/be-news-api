const express = require('express');
const router = express.Router();
const { getArticleById, getArticles, patchVotes } = require('../controllers/articles.controllers');

router.get('/articles/:article_id', getArticleById);
router.get('/articles', getArticles);
router.patch('/articles/:article_id', patchVotes);

module.exports = router;