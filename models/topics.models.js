const db = require('../db/connection')
const { checkTopicExists } = require('../db/utils/utils')


exports.fetchTopics = () => {
    
    const queryStr = "SELECT * FROM topics"

    return db.query(queryStr).then(( {rows} ) => {
        return rows
    })
}

exports.addTopic = (topicBody) => {

    const queryStr = `
    INSERT INTO topics (slug, description)
    VALUES ($1, $2)
    RETURNING *`

    checkTopicExists(topicBody.slug)

    const queryValues = [topicBody.slug, topicBody.description]

    return checkTopicExists(topicBody.slug).then((topicExists) => {
        if (topicExists) {
            return Promise.reject({status: 400, message: 'bad request'})
        } else {
            return db.query(queryStr, queryValues)
        }
    }).then(({rows}) => {
        return rows[0]
    })
}