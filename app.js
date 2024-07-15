const express = require("express");
const app = express();
app.use(express.json());

const {handleServerError} = require('./errors/errors')

const endpoints = require('./endpoints.json')

const {topicsControllers: {getTopics}} = require('./controllers/index.controllers');



app.get('/api', (request, response, next) => {
    response.status(200).send({endpoints})
})


app.get('/api/topics', getTopics)


//URL not found
app.all("*", (request, response) => {
    response.status(404).send({msg: "Not Found!"})
})


//Error Handling
app.use(handleServerError)


module.exports = app