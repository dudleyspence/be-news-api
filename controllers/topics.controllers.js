const { topicsModels: {fetchTopics} } = require('../models/index.models')

exports.getTopics = (request, response, next) => {


    fetchTopics().then((topics) => {
        response.status(200).send({topics})
    })
    .catch(next)
};