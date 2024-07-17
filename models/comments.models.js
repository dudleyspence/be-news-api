
const db = require('../db/connection')
const {checkArticleIdExists, checkUsernameExists} = require('../db/utils/utils')


exports.fetchComments = (sort_by = 'created_at', order = 'ASC', article_id) => {
    
    const validSortBys = ['created_at']

    const queryValues = []
    let queryStr = `SELECT * FROM comments `

    
    const isValidId = article_id.match(/^\d+$/)
    
    if (!isValidId){
        return Promise.reject({status: 400, message: 'bad request'})
    }

    const promiseArray = []

    if(article_id){
        queryStr += `WHERE article_id=$1 `
        queryValues.push(article_id)
        promiseArray.push(checkArticleIdExists())
    }
    
    
     if (!validSortBys.includes(sort_by)){
        
        return Promise.reject({status: 400, message: 'invalid query'})
    }

    queryStr += `ORDER BY ${sort_by} `

    if (!['asc', 'desc', 'ASC', 'DESC'].includes(order)){
        return Promise.reject({status: 400, message: 'invalid query'})
    }

    queryStr += `${order}`

    promiseArray.push(db.query(queryStr, queryValues))

    return Promise.all(promiseArray).then(([articleExists, {rows}]) => {
        if (!articleExists && rows.length ===0){
            return Promise.reject({status: 404, message: "not found" });
        } else {
            return rows
        }
    })

}

exports.addComment = (comment, article_id) => {



    if (Object.keys(comment).length !== 2 || Object.keys(comment)[0] !== 'username' || Object.keys(comment)[1] !== 'body'){
        return Promise.reject({status: 400, message: 'bad request'})
    }

    if (typeof comment.username !== 'string' || typeof comment.body !== 'string'){
        return Promise.reject({status: 400, message: 'bad request'})
    }


    const isValidId = article_id.match(/^\d+$/)
    
    if (!isValidId){
        return Promise.reject({status: 400, message: 'bad request'})
    }

    const postData = [comment.body, comment.username, Number(article_id), votes = 0]

    let queryStr = `INSERT INTO comments 
    (body, author, article_id, votes) 
    VALUES ($1, $2, $3, $4) 
    RETURNING *`

    return checkUsernameExists(comment.username).then((usernameExists) => {
        if (!usernameExists){
            return Promise.reject({status: 400, message: 'bad request'})
        } else {
            return db.query(queryStr, postData)
        }
    }).then(({rows}) => {
        return rows[0]
    }) 



}