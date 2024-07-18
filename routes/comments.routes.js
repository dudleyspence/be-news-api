const express = require('express');
const router = express.Router();
const { getComments, postComment, deleteComment, patchCommentVotes } = require('../controllers/comments.controllers');

router.get('/articles/:article_id/comments', getComments);
router.post('/articles/:article_id/comments', postComment);
router.delete('/comments/:comment_id', deleteComment);
router.patch('/comments/:comment_id', patchCommentVotes);


module.exports = router;