const supertest = require("supertest");
const fastify   = require("../server.js");
const server = fastify.server;

describe("Probando rutas servidor ", () => {
  it("should return login page", (done) => {
    supertest(server)
    .get("/login")
    .expect(200)
    .end((err, res) => {
        if (err) return done.fail(err);
        done();
      });
  });
});
