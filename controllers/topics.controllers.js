const {fetchTopics, addTopic} = require('../models/topics.models')

exports.getTopics = (request, response, next) => {


    fetchTopics().then((topics) => {
        response.status(200).send({topics})
    })
    .catch(next)
};

exports.postTopic = (request, response, next) => {

    const topicBody = request.body

    addTopic(topicBody).then((topic) => {
        response.status(200).send({topic})
    })
    .catch(next)
}