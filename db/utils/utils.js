const db = require('../connection')

exports.checkArticleIdExists = (article_id) => {
    return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [article_id])
    .then(({rows})=>{
        return rows.length>0
    })
}


exports.checkUsernameExists = (username) => {
    return db
    .query(`SELECT * FROM users WHERE username=$1 `, [username])
    .then(({rows})=>{
        return rows.length>0
    })
}

exports.checkCommentExists = (comment_id) => {
    return db
    .query(`SELECT * FROM comments WHERE comment_id=$1`, [comment_id])
    .then(({rows})=>{
        return rows.length>0
    })
}

exports.checkTopicExists = (topic) => {
    return db
    .query(`SELECT * FROM topics WHERE slug=$1`, [topic])
    .then(({rows})=>{
        return rows.length>0
    })
}

exports.checkNewArticleIsValid = (article) => {

    const newArticleRequirements = ['author', 'title', 'body', 'topic']
    
    includesRequirements = article.every((articleKey) => articleKey.includes(newArticleRequirements))


    

    


}