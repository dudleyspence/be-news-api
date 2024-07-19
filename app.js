const express = require("express");
const app = express();
app.use(express.json());

const {handleServerError, handleCustomError, handlePSQLErrors} = require('./errors/errors')

const endpoints = require('./endpoints.json')



const { topicsRouter, articlesRouter, commentsRouter, usersRouter } = require('./routes/index.routes');



//GET endpoints
app.get('/api', (request, response) => {
    response.status(200).send({endpoints})
})


// Use routers
app.use('/api', topicsRouter);
app.use('/api', articlesRouter);
app.use('/api', commentsRouter);
app.use('/api', usersRouter);



//URL not found
app.all("*", (request, response) => {
    response.status(404).send({msg: "Not Found!"})
})


//Error Handling
app.use(handlePSQLErrors)
app.use(handleCustomError)
app.use(handleServerError)


module.exports = app