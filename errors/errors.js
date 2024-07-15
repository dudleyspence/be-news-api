




exports.handleServerError = (err, request, response, next) => {
    response.status(500).send({message: 'Internal server error'})
}