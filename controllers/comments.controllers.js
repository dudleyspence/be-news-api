const { fetchComments, addComment, removeComment, incVotesByCommentId } = require('../models/comments.models')


exports.getComments = (request, response, next) => {
    const { sort_by, order, limit, p } = request.query

    const {article_id} = request.params

    fetchComments(sort_by, order, limit, p,  article_id).then((comments) => {

        response.status(200).send({comments})
    })
    .catch(next)
    
}

exports.postComment = (request, response, next) => {
    const comment = request.body
    const {article_id} = request.params
    addComment(comment, article_id).then((comment) => {
        response.status(200).send({comment})
    })
    .catch(next)
}

exports.deleteComment = (request, response, next) => {

    const { comment_id } = request.params

    removeComment(comment_id).then(() => {
        response.status(204).send({message: 'no content'})
    })
    .catch(next)
}

exports.patchCommentVotes = (request, response, next) => {
    const {comment_id} = request.params
    const patchBody = request.body

    incVotesByCommentId(comment_id, patchBody).then((comment) => {
        response.status(200).send({comment})
    })
    .catch(next)
}