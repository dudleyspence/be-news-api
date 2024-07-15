const express = require("express");
const app = express();
app.use(express.json());

const {handleServerError, handleCustomError} = require('./errors/errors')

const endpoints = require('./endpoints.json')

const {topicsControllers: {getTopics}, articlesControllers: {getArticleById}} = require('./controllers/index.controllers');

app.get('/api', (request, response, next) => {
    response.status(200).send({endpoints})
})


//topics
app.get('/api/topics', getTopics)

//articles
app.get('/api/articles/:article_id', getArticleById)



//URL not found
app.all("*", (request, response) => {
    response.status(404).send({msg: "Not Found!"})
})


//Error Handling
app.use(handleCustomError)
app.use(handleServerError)


module.exports = app