const request = require("supertest");
const app = require("./app");

describe("GET /api/v1/posts", () => {
    test("should respond with 200 status", async () => {
        const response = await request(app).get("/api/v1/posts");
        expect(response.statusCode).toBe(200);
    });

    test("should specify json in content type header", async () => {
        const response = await request(app).get("/api/v1/posts");
        expect(response.headers['content-type']).toEqual(expect.stringContaining("json"));
    });
});
