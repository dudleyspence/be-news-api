const db = require('../db/connection')
const {checkUsernameExists} = require('../db/utils/utils')

exports.fetchUsers = () => {
    const queryStr = `SELECT * FROM users `

    return db.query(queryStr).then(( {rows} ) => {

        return rows
    })
}

exports.fetchUserByUsername = (username) => {
    let queryStr = `SELECT * FROM users WHERE username=$1`


    return Promise.all([checkUsernameExists(username), db.query(queryStr, [username])])
    .then(([usernameExists, {rows}]) => {
        if (!usernameExists){
            return Promise.reject({status: 404, message: 'not found'})
        } else {
            return rows[0]
        }
    })

}