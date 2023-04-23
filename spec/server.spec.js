const supertest = require("supertest");
const assert = require("assert");
const fastify = require("../server.js");

describe("Probando rutas servidor ", () => {
  it("should return login page", (done) => {
    supertest(fastify).
    get("/login").
    expect(200);
  });
});
