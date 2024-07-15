const { topicsModels } = require('../models/index.models')
const {fetchTopics} = topicsModels

exports.getTopics = (request, response, next) => {


    fetchTopics().then((topics) => {
        response.status(200).send({topics})
    })
    .catch(next)
};