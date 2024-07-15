


exports.handleCustomError = (err, request, response, next) => {
    if (err.status && err.message) {
        response.status(err.status).send({message: err.message})
    } else {
        next(err)
    }
}

exports.handleServerError = (err, request, response, next) => {
    response.status(500).send({message: 'Internal server error'})
}