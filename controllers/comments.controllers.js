const { commentsModels } = require('../models/index.models')
const { fetchComments, addComment } = commentsModels


exports.getComments = (request, response, next) => {
    const { sort_by, order } = request.query

    const {article_id} = request.params

    fetchComments(sort_by, order, article_id).then((comments) => {

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