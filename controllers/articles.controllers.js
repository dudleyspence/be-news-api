const { articlesModels } = require('../models/index.models')
const {fetchArticleById, fetchArticles, incVotesByArticleId} = articlesModels

exports.getArticleById = (request, response, next) => {
    const {article_id} = request.params
    fetchArticleById(article_id).then((article) => {
        response.status(200).send({article})
    })
    .catch(next)
}


exports.getArticles = (request, response, next) => {

    const { sort_by, order, topic } = request.query
    fetchArticles(sort_by, order, topic).then((articles) => {
        response.status(200).send({articles})
    })
    .catch(next)

}
 
exports.patchVotes = (request, response, next) => {
    const {article_id} = request.params
    const patchBody = request.body

    incVotesByArticleId(article_id, patchBody).then((votes) => {
        response.status(200).send(votes)
    })
    .catch(next)
}