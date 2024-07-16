const db = require('../connection')

exports.checkArticleIdExists = (article_id) => {
    return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [article_id])
    .then(({rows})=>{
        return rows.length>0
    })
}