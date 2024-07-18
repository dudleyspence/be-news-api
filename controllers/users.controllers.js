const {fetchUsers, fetchUserByUsername} = require('../models/users.models')


exports.getUsers = (request, response, next) => {

    fetchUsers().then((users) => {
        response.status(200).send({users})
    })
    .catch(next)
}

exports.getUserByUsername = (request, response, next) => {

    const { username } = request.params

    fetchUserByUsername(username).then((user) => {
        response.status(200).send({user})
    })
    .catch(next)
}