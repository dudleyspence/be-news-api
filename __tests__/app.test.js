const request = require("supertest");
const app = require('../app');

const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

const endpoints = require('../endpoints.json')

beforeAll(() => seed(data));
afterAll(() => db.end());

describe( "app", () => {

    describe("404: URL not found", () => {
        test("when given an endpoint that isnt in app.js, returns 'Not Found!", () => {
            return request(app)
            .get('/api/incorrect-url')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('Not Found!')
            })
        })
    })

    describe( "GET /api", () => {

        test( "200: responds with a JSON showing all available endpoints", () => {
            return request(app)
            .get('/api')
            .expect(200)
            .then(({body}) => {
                expect(body.endpoints).toEqual(endpoints)
            })
        } )
    } )

    describe( "/api/topics/", () => {

        describe( "GET", () => {

            test( "200: returns an array of topic objects with properties slug and description", () => {
                return request(app)
                .get('/api/topics')
                .expect(200)
                .then((response) => {
                    const body = response.body
                    expect(body.topics).toHaveLength(3)
                    body.topics.forEach((topic) => {
                        expect(topic).toMatchObject({
                            slug: expect.any(String),
                            description: expect.any(String)
                        })
                        
                    });
                })

            } )
        } )
    } )

    describe( "/api/articles/:article_id", () => {

        describe( "GET", () => {

            test( "400: Returns bad request when given an invalid id", () => {

                return request(app)
                .get('/api/articles/invalid_id')
                .expect(400)
                .then(({body: {message}}) => {
                    expect(message).toBe('bad request')
                })
            } )

            test( "200: returns the article with the desired properties", () => {
                
                return request(app)
                .get('/api/articles/1')
                .expect(200)
                .then(({body: {article}}) => {
                    expect(Object.keys(article)).toHaveLength(8)
                    expect(article).toMatchObject({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String)
                    })
                })

            })

            test( "200: returns the article with the given article_id", () => {
                
                return request(app)
                .get('/api/articles/1')
                .expect(200)
                .then(({body: {article}}) => {
                    const expected = {
                        article_id: 1,
                        title: "Living in the shadow of a great man",
                        topic: "mitch",
                        author: "butter_bridge",
                        body: "I find this existence challenging",
                        created_at: "2020-07-09T19:11:00.000Z",
                        votes: 100,
                        article_img_url:
                          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                      }
                    expect(article).toEqual(expected)
                })
            })

            test( "404: returns not found", () => {
                return request(app)
                .get('/api/articles/99999')
                .expect(404)
                .then(({body: {message}}) => {
                    expect(message).toBe('not found')
                })
            } )

        })

        describe("PATCH", () => {

            test("200: returns the updated article", () => {

                return request(app)
                .patch('/api/articles/1')
                .send({inc_votes: 1})
                .expect(200)
                .then(({body: {votes}}) => {
                    expect(votes).toBe(101)
                })
            })

            test( "400: returns bad request when the body doesnt contain the correct fields", () => {
                const incVotes = {}
                return request(app).patch('/api/articles/1').send(incVotes)
                .expect(400)
                .then(({body: {message}})=> {
                    expect(message).toBe('bad request')
                })
            } )

            test( "400: returns bad request when the body contains a field with a value that is invalid", () => {
                const incVotes = {inc_votes: 'invalid'}
                return request(app).patch('/api/articles/1').send(incVotes)
                .expect(400)
                .then(({body: {message}})=> {
                    expect(message).toBe('bad request')
                })
            } )

            test( "400: returns bad request when the given article_id is potentially valid but doesnt exist in the article table", () => {
                const incVotes = {inc_votes: 2}
                return request(app).patch('/api/articles/9999999').send(incVotes)
                .expect(400)
                .then(({body: {message}})=> {
                    expect(message).toBe('bad request')
                })
            } )
            
        })
    
    })

    describe( "/api/articles", () => {

        describe( "GET", () => {

            test( "200: returns an array of article objects with the desired properties", () => {
                return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({body: {articles}}) => {

                    expect(articles).toHaveLength(13)
                    articles.forEach((article) => {
                        expect(article).toMatchObject({
                            article_id: expect.any(Number),
                            title: expect.any(String),
                            topic: expect.any(String),
                            author: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            article_img_url: expect.any(String),
                            comment_count: expect.any(Number)
                        })
                        
                    });
                })

            } )

            test( "200: the array of objects is sorted in descending order of date", () => {
                return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({body: {articles}}) => {
                    expect(articles[0]).toEqual({
                        article_id: 3,
                        title: "Eight pug gifs that remind me of mitch",
                        topic: "mitch",
                        author: "icellusedkars",
                        created_at: "2020-11-03T08:12:00.000Z",
                        article_img_url:
                          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                        votes: 0,
                        comment_count: 2
                      })
                })

            } )

            test( "400: returns bad request when given an invalid query", () => {
                return request(app)
                .get('/api/articles?sort_by=invalid_query')
                .expect(400)
                .then(({body: {message}}) => {
                    expect(message).toBe('invalid query')
                })


            } )

        } )

        describe("GET sort_by and order queries", () => {
            test( "200: the array of objects is sorted in descending order of votes", () => {
                return request(app)
                .get('/api/articles?sort_by=votes')
                .expect(200)
                .then(({body: {articles}}) => {
                    expect(articles).toBeSortedBy('votes', {descending: true})
                })

            } )
            test( "200: the array of objects is sorted in ascending order of title", () => {
                return request(app)
                .get('/api/articles?sort_by=title&order=asc')
                .expect(200)
                .then(({body: {articles}}) => {
                    expect(articles).toBeSortedBy('title', {ascending: true})
                })

            } )

            test( "400: returns bad request when given an invalid query", () => {
                return request(app)
                .get('/api/articles?sort_by=invalid_query')

                .expect(400)
                .then(({body: {message}}) => {
                    expect(message).toBe('invalid query')
                })

            })

            test("400: returns invalid query when given an order that isnt valid", () => {
                return request(app)
                .get('/api/articles?order=upsidedown')
                .expect(400)
                .then(({body: {message}}) => {
                    expect(message).toBe('invalid query')
                })
            })



        })

        describe( "GET topic queries", () => {

            //ignores queries that dont exist (/api/articles?potato=idontexist)
            //When given a topic but one that doesnt exist returns empty
            // e.g. (/api/articles?topic=idontexist)

            test( "200: responds with the articles with the given topic", () => {
                return request(app)
                .get('/api/articles?topic=mitch')
                .expect(200)
                .then(({body: {articles}}) => {

                    articles.forEach((article) => {
                        expect(article).toMatchObject({
                            article_id: expect.any(Number),
                            title: expect.any(String),
                            topic: 'mitch',
                            author: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            article_img_url: expect.any(String),
                            comment_count: expect.any(Number)
                        })
                        
                    });
                })
            } )
        } )

    })

    describe( "/api/articles/:article_id/comments", () => {

        describe( "GET", () => {

            test( "200: returns the comments each with the desired properties", () => {
                
                return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({body: {comments}}) => {
                    expect(comments).toHaveLength(11)

                    comments.forEach((comment) => {
                        expect(Object.keys(comment)).toHaveLength(6)
                        expect(comment).toMatchObject({
                            comment_id: expect.any(Number),
                            author: expect.any(String),
                            body: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            article_id: 1
                        })
                    })
                    

                })

            })

            test( "200: returns the comments with the given article_id in the correct order", () => {
                
                return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({body: {comments}}) => {
                    expect(comments).toBeSortedBy('created_at')
                })
            })

            test( "404: returns not found when the given article ID has no comments", () => {
                return request(app)
                .get('/api/articles/99999/comments')
                .expect(404)
                .then(({body: {message}}) => {
                    expect(message).toBe('not found')
                })
            } )

            test( "400: Returns bad request when given an invalid id", () => {

                return request(app)
                .get('/api/articles/invalid_id/comments')
                .expect(400)
                .then(({body: {message}}) => {
                    expect(message).toBe('bad request')
                })
            } )
        } )

        describe( "POST", () => {

            test( "400: returns bad request when the body doesnt contain the correct fields", () => {
                const newComment = {}
                return request(app).post('/api/articles/1/comments').send(newComment)
                .expect(400)
                .then(({body: {message}})=> {
                    expect(message).toBe('bad request')
                })
            } )

            test( "400: returns bad request when the body contains a field with a value that is invalid", () => {
                const newComment = {username: 123, body:'my username isnt valid'}
                return request(app).post('/api/articles/1/comments').send(newComment)
                .expect(400)
                .then(({body: {message}})=> {
                    expect(message).toBe('bad request')
                })
            } )

            test( "400: returns bad request when the username provided doesnt exist in the users table", () => {
                const newComment = {username: 'dudleyspence', body:'my username isnt valid'}
                return request(app).post('/api/articles/1/comments').send(newComment)
                .expect(400)
                .then(({body: {message}})=> {
                    expect(message).toBe('bad request')
                })
            })

            test( "400: returns bad request when given an invalid article_id", () => {
                const newComment = {username: 'butter_bridge', body: 'my first posted comment'}
                return request(app).post('/api/articles/invalid_id/comments').send(newComment)
                .expect(400)
                .then(({body: {message}})=> {
                    expect(message).toBe('bad request')
                })

            } )

            test( "404: returns not found when given an article_id that doesnt exist", () => {
                const newComment = {username: 'butter_bridge', body: 'my first posted comment'}
                return request(app).post('/api/articles/invalid_id/comments').send(newComment)
                .expect(400)
                .then(({body: {message}})=> {
                    expect(message).toBe('bad request')
                })

            } )

            test( "200: ignores any extra comment properties", () => {
                const newComment = {username: 'butter_bridge', body: 'my first posted comment', extra_property: 'ignore me'}
                return request(app).post('/api/articles/1/comments').send(newComment)
                .expect(200)
                .then(({body: {comment}})=> {
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        votes: 0,
                        article_id: 1,
                        author: 'butter_bridge',
                        body: 'my first posted comment'
                    })
                })
            } )
            
            test( "200: Returns the posted comment", () => {
                const newComment = {username: 'butter_bridge', body: 'my first posted comment'}
                return request(app).post('/api/articles/1/comments').send(newComment)
                .expect(200)
                .then(({body: {comment}})=> {
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        votes: 0,
                        article_id: 1,
                        author: 'butter_bridge',
                        body: 'my first posted comment'
                    })
                });
            })

        } )
    } )

    describe( "/api/comments/:comment_id", () => {

        describe( "DELETE", () => {

            test( "204: deletes comment using comment_id and responds with no content", () => {
                return request(app)
                .delete('/api/comments/1')
                .expect(204)
            } )

            test( "404: responds 'not found' when trying to delete a comment that doesnt exist", () => {
                return request(app)
                .delete('/api/comments/999999')
                .expect(404)
                .then(({body: {message}}) => {
                    expect(message).toBe('not found')
                })
            } )

            test( "400: responds bad request when trying to delete a comment with an invalid id", () => {
                return request(app)
                .delete('/api/comments/invalid')
                .expect(400)
                .then(({body: {message}}) => {
                    expect(message).toBe('bad request')
                })
            } )
        } )
    } )

    describe( "/api/users", () => {

        describe( "GET", () => {

            test( "200: returns all the users", () => {
                return request(app)
                .get('/api/users')
                .expect(200)
                .then(({body: {users}}) => {
                    expect(users).toHaveLength(4)
                    users.forEach((user) => {
                        expect(user).toMatchObject({
                            username: expect.any(String),
                            name: expect.any(String),
                            avatar_url: expect.any(String)
                        })
                    })
                    
                })
            } )
        } )
    } )

})

