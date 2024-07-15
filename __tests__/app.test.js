const request = require("supertest");
const app = require('../app');

const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");


beforeAll(() => seed(data));
afterAll(() => db.end());

describe( "app", () => {

    describe("URL not found", () => {
        test("when given an endpoint that isnt in app.js, returns 'Not Found!", () => {
            return request(app)
            .get('')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('Not Found!')
            })
        })
    })

    describe( "/api/topics", () => {

        describe( "GET", () => {

            test( "returns a 200 and an array of topic objects with properties slug and description", () => {
                return request(app)
                .get('/api/topics')
                .expect(200)
                .then((response) => {
                    const body = response.body
                    expect(body.topics.length).toBeGreaterThan(0)

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
    
} )