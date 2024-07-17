# News API

Welcome to Be News API!

This repository contains the backend API for a community-oriented application. The API is designed to provide programmatic access to application data, serving as a foundational backend service similar to those found in social platforms. It enables users to interact with various resources such as articles, comments, users, and topics through a RESTful architecture.


Hosted Version
You can find a hosted version of this project at https://be-news-api-2ebb.onrender.com


Summary
Be News API is developed to offer essential functionalities akin to popular social platforms. It supports CRUD operations (Create, Read, Update, and Delete) on articles, commenting on articles, voting on content, and retrieving information about different topics. The API facilitates seamless interaction between frontend applications and the database.

Getting Started
To get a local copy up and running follow these simple steps.

Prerequisites
Before you begin, ensure you have met the following requirements:

Node.js (version 14 or higher)
PostgreSQL (version 12 or higher)


Installation:

Clone the repo:
    git clone https://github.com/your_username/community-hub-api.git

Navigate to the project directory:
    cd community-hub-api
    
Install dependencies:
    npm install



Create two .env files:

.env.development for development environment variables.
.env.test for test environment variables.


each of these files should be configured with necessary variables
- PGDATABASE=[database_name] 

one database will be for testing purposes and the other for development purposes.

Seed the local database:
    npm run seed

Run the tests to check everything is correct:
    npm test



--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)


