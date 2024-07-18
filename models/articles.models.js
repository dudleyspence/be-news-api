const db = require('../db/connection')
const { checkArticleIdExists } = require('../db/utils/utils')


exports.fetchArticleById = (article_id) => {

    let queryStr = `SELECT 
    articles.author, 
    articles.title, 
    articles.article_id, 
    articles.topic, 
    articles.created_at, 
    articles.votes,
    articles.body, 
    articles.article_img_url,
    COUNT(comments.article_id)::INT AS comment_count
    FROM articles 
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id `

    const isValidId = article_id.match(/^\d+$/)
    
    if (!isValidId){
        return Promise.reject({status: 400, message: 'bad request'})
    }

    
    queryStr += `WHERE articles.article_id = $1 `


    queryStr +=`GROUP BY 
    articles.article_id `

    return checkArticleIdExists(article_id).then((articleExists) => {
        if (!articleExists){
            return Promise.reject({status: 404, message: "not found" })
        } else {
            return db.query(queryStr, [article_id])
        }
    }).then(({rows}) => {
        return rows[0]
    })

}

exports.fetchArticles = (sort_by = 'created_at', order = 'DESC', topic, author) => {
    const validSortBys = ['created_at', 'author', 'title', 'votes', 'comment_count', 'article_id']

    queryValues = []

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
    ON articles.article_id = comments.article_id `

    if (author){
        queryStr += `WHERE articles.author=$1 `
        queryValues.push(author)
    }

    if (topic){
        queryStr += `WHERE articles.topic=$1 `
        queryValues.push(topic)
    }


    queryStr +=`GROUP BY 
    articles.article_id `


    if (!validSortBys.includes(sort_by)){
        
        return Promise.reject({status: 400, message: 'invalid query'})
    }


    queryStr += `ORDER BY ${sort_by} `



    if (!['asc', 'desc', 'ASC', 'DESC'].includes(order)){
        return Promise.reject({status: 400, message: 'invalid query'})
    }

    queryStr += `${order}`


    return db.query(queryStr, queryValues).then(( {rows} ) => {
        return rows
        
    })


}

exports.incVotesByArticleId = (article_id, patchBody) => {

    if (Object.keys(patchBody).length !== 1 || Object.keys(patchBody)[0] !== "inc_votes"){
        return Promise.reject({status: 400, message: 'bad request'})
    }
    
    const {inc_votes} = patchBody


    const isValidId = article_id.match(/^\d+$/)

    const isValidIncVotes = (typeof inc_votes === 'number')
    
    if (!isValidId || !isValidIncVotes){
        return Promise.reject({status: 400, message: 'bad request'})
    }

    let querySQL = `
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING votes `


    return checkArticleIdExists(article_id).then((articleExists) => {
        if (!articleExists){
            return Promise.reject({status: 400, message: 'bad request'})
        } else {
            return db.query(querySQL, [inc_votes, article_id])
        }
    })
    .then(({rows}) => {
        return rows[0]
    })
    

}