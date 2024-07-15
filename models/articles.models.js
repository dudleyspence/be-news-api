const db = require('../db/connection')


exports.fetchArticleById = (article_id) => {

    let queryStr = `SELECT * FROM articles `

    const isValidId = article_id.match(/^\d+$/)
    
    if (!isValidId){
        return Promise.reject({status: 400, message: 'bad request'})
    }

    
    queryStr += `WHERE article_id = $1`



    return db.query(queryStr, [article_id]).then(( {rows} ) => {
        return rows[0]
    })
}