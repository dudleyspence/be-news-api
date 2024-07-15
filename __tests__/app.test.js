const request = require("supertest");
const app = require('../app');

const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

const endpoints = require('../endpoints.json')

beforeAll(() => seed(data));
afterAll(() => db.end());

describe( "app", () => {

    describe("URL not found", () => {
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

        test( "responds with a JSON showing all available endpoints", () => {
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

            test( "returns a 200 and an array of topic objects with properties slug and description", () => {
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

            

        } )

    } )
    
} )