const { commentsModels } = require('../models/index.models')
const { fetchComments } = commentsModels


exports.getComments = (request, response, next) => {
    const { sort_by, order } = request.query

    const {article_id} = request.params

    fetchComments(sort_by, order, article_id).then((comments) => {

        response.status(200).send({comments})
    })
    .catch(next)
    
}