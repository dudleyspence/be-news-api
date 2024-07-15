const db = require('../db/connection')


exports.fetchTopics = () => {
    
    const queryStr = "SELECT * FROM topics"

    return db.query(queryStr).then(( {rows} ) => {
        return rows
    })
}
