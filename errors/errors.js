
exports.handlePSQLErrors = (err, request, response, next) => {
    if (err.code ==='22P02') {
        response.status(400).send({message: 'Invalid id type'});
    }
    else {
        next(err)
    }
}

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