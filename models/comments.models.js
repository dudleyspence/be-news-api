
const db = require('../db/connection')
const {checkArticleIdExists} = require('../db/utils/utils')


exports.fetchComments = (sort_by = 'created_at', order = 'DESC', article_id) => {
    
    const validSortBys = ['created_at']

    const queryValues = []
    let queryStr = `SELECT * FROM comments `


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

    return Promise.all(promiseArray).then(([categoryExists, {rows}]) => {
        if (!categoryExists && rows.length ===0){
            return Promise.reject({status: 404, message: "not found" });
        } else {
            return rows
        }
    })

}
