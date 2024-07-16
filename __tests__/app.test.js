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
    } )

    describe( "/api/articles/:article_id/comments", () => {

        describe( "GET", () => {

            test( "200: returns the correct number of comments for a given article", () => {
                return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({body: {comments}}) => {
                    expect(comments).toHaveLength(11)
                })
            } )

            test( "200: returns the comments each with the desired properties", () => {
                
                return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({body: {comments}}) => {
                    comments.forEach((comment) => {
                        expect(Object.keys(comment)).toHaveLength(6)
                        expect(comment).toMatchObject({
                            comment_id: expect.any(Number),
                            author: expect.any(String),
                            body: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            article_id: expect.any(Number)
                        })
                    })
                    

                })

            })

            test( "200: returns the comments with the given article_id in the correct order", () => {
                
                return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({body: {comments}}) => {
                    const expected = {
                        comment_id: 5,
                        body: 'I hate streaming noses',
                        article_id: 1,
                        author: 'icellusedkars',
                        votes: 0,
                        created_at: '2020-11-03T20:00:00.000Z'
                      }
                    expect(comments[0]).toEqual(expected)
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
        } )
    } )

})

