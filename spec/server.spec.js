const supertest = require("supertest");
const assert = require("assert");
const fastify = require("../server.js");

describe("Probando rutas servidor ", () => {
  it("should return login page", (done) => {
    supertest(fastify.server)
    .get("/login")
    .expect(200, done)
    // .end((error) => { error ? done.fail(error) : done() });
  });
});
