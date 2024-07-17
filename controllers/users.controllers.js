const { usersModels: { fetchUsers } } = require('../models/index.models')


exports.getUsers = (request, response, next) => {

    fetchUsers().then((users) => {
        response.status(200).send({users})
    })
    .catch(next)
}
