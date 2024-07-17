const express = require("express");
const app = express();
app.use(express.json());

const {handleServerError, handleCustomError, handlePSQLErrors} = require('./errors/errors')

const endpoints = require('./endpoints.json')

const {topicsControllers: {getTopics}, 
articlesControllers: {getArticleById, getArticles, patchVotes}, 
commentsControllers: {getComments, postComment, deleteComment}, usersControllers: {getUsers}} 
= require('./controllers/index.controllers');

app.get('/api', (request, response, next) => {
    response.status(200).send({endpoints})
})


//topics
app.get('/api/topics', getTopics)

//articles
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles', getArticles)
app.patch('/api/articles/:article_id', patchVotes)


//comments
app.get('/api/articles/:article_id/comments', getComments)
app.post('/api/articles/:article_id/comments', postComment)
app.delete('/api/comments/:comment_id', deleteComment)

//users
app.get('/api/users', getUsers)


//URL not found
app.all("*", (request, response) => {
    response.status(404).send({msg: "Not Found!"})
})


//Error Handling
app.use(handlePSQLErrors)
app.use(handleCustomError)
app.use(handleServerError)


module.exports = app