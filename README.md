# News API

Create a setup.sql:
- This file will drop any database if it exists with the database name
- This will create a new database using the chosen name

- Both of these steps will be repeated to create the test database with a slightly different name.

Connecting the two databases locally:
- create a file .env.development
- create a file .env.test

each of these files should contain the line 
- PGDATABASE= \<database name> 

one database will be for testing purposes and the other for development purposes.





--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)


