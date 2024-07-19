const {fetchArticleById, fetchArticles, incVotesByArticleId, addArticle, removeArticle} = require('../models/articles.models')

exports.getArticleById = (request, response, next) => {
    const {article_id} = request.params
    fetchArticleById(article_id).then((article) => {
        response.status(200).send({article})
    })
    .catch(next)
}


exports.getArticles = (request, response, next) => {

    const { sort_by, order, topic, author, limit, p} = request.query
    fetchArticles(sort_by, order, limit, p, topic, author).then(([filteredArticles, total_results]) => {
        response.status(200).send({articles:filteredArticles, total: total_results})
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

exports.deleteArticle = (request, response, next) => {
    const {article_id} = request.params

    removeArticle(article_id).then(() => {
        return response.sendStatus(204)
    })
    .catch(next)
}