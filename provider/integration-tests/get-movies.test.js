const request = require("supertest")
const { server, importData } = require("../provider")
const movies = require("../../data/movies.json")

describe("GET empty", () => {
    test("/movies", async () => {
        await request(server)
            .get("/movies")
            .expect("Content-Type", /json/)
            .expect(200)
            .expect((res) => {
                expect(res.body).toMatchObject([])
            })
    })

    test("/movie/:id not found", async () => {
        await request(server)
            .get("/movie/1")
            .expect("Content-Type", /text/)
            .expect(404)
            .expect((res) => {
                expect(res.text).toBe("Movie not found")
            })
    })
})

describe("GET data", () => {
    beforeEach(() => {
        importData()
    })

    test("/movies", async () => {
        await request(server)
            .get("/movies")
            .expect("Content-Type", /json/)
            .expect(200)
            .expect((res) => {
                expect(res.body[0]).toMatchObject(movies[0])
                expect(res.body).toStrictEqual(movies)
            })
    })

    test("/movie/:id not found", async () => {
        await request(server)
            .get("/movie/100")
            .expect("Content-Type", /text/)
            .expect(404)
            .expect((res) => {
                expect(res.text).toBe("Movie not found")
            })
    })
    
    test("/movie/:id success", async () => {
        await request(server)
            .get("/movie/1")
            .expect("Content-Type", /json/)
            .expect(200)
            .expect((res) => {
                expect(res.body).toStrictEqual(movies[0])
            })
    })
})