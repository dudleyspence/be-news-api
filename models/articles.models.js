const db = require('../db/connection')


exports.fetchArticleById = (article_id) => {

    const isValidId = (typeof article_id === 'number')
    
    if (!isValidId){
        return Promise.reject({status: 400, message: 'bad request'})
    }

    const queryStr = ""

    return db.query(queryStr).then(( {rows} ) => {
        return rows
    })
}