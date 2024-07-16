const db = require('../db/connection')


exports.fetchArticleById = (article_id) => {

    let queryStr = `SELECT * FROM articles `

    const isValidId = article_id.match(/^\d+$/)
    
    if (!isValidId){
        return Promise.reject({status: 400, message: 'bad request'})
    }

    
    queryStr += `WHERE article_id = $1`



    return db.query(queryStr, [article_id]).then(( {rows} ) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, message: "not found" });
        } else {
            return rows[0]
        }
    })
}


exports.fetchArticles = (sort_by = 'created_at', order = 'desc') => {
    const validSortBys = ['created_at']


    let queryStr = `SELECT 
    articles.author, 
    articles.title, 
    articles.article_id, 
    articles.topic, 
    articles.created_at, 
    articles.votes, 
    articles.article_img_url,
    COUNT(comments.article_id)::INT AS comment_count
    FROM articles 
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id
    GROUP BY 
    articles.article_id `


    if (!validSortBys.includes(sort_by)){
        
        return Promise.reject({status: 400, message: 'invalid query'})
    }

    queryStr += `ORDER BY ${sort_by} `

    if (!['asc', 'desc'].includes(order)){
        return Promise.reject({status: 400, message: 'invalid query'})
    }
    queryStr += `${order}`


    return db.query(queryStr).then(( {rows} ) => {
        return rows
        
    })


}

