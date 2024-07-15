const express = require("express");
const app = express();
app.use(express.json());

const {} = require('./errors/errors')
const {topicsControllers: {getTopics}} = require('./controllers/index.controllers');


const { handleServerError } = require("./errors/errors");




app.get('/api/topics', getTopics)


//URL not found
app.all("*", (request, response) => {
    response.status(404).send({msg: "Not Found!"})
})


//Error Handling
app.use(handleServerError)


module.exports = app