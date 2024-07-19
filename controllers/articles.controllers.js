const {fetchArticleById, fetchArticles, incVotesByArticleId, addArticle} = require('../models/articles.models')

exports.getArticleById = (request, response, next) => {
    const {article_id} = request.params
    fetchArticleById(article_id).then((article) => {
        response.status(200).send({article})
    })
    .catch(next)
}


exports.getArticles = (request, response, next) => {

    const { sort_by, order, topic, author} = request.query
    fetchArticles(sort_by, order, topic, author).then((articles) => {
        response.status(200).send({articles})
    })
    .catch(next)

}
 
exports.patchArticleVotes = (request, response, next) => {
    const {article_id} = request.params
    const patchBody = request.body

    incVotesByArticleId(article_id, patchBody).then((votes) => {
        response.status(200).send(votes)
    })
    .catch(next)
}

exports.postArticle = (request, response, next) => {

    const article = request.body

    addArticle(article).then((article) => {
        response.status(200).send({article})
    })
    .catch(next)

}