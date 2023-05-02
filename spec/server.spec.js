const supertest = require("supertest");
const fastify = require("../server.js");
const app=fastify
//const server = app.server;

describe("Probando rutas servidor ", () => {
  it("GET / returns status 200", (done) => {
    supertest(app)
      .get("/")
      .expect(200)
      .expect(function (res) {
        console.log("BODY ACERCA DE ", res.body); // Para comprobar qué contiene exactamente res.body
      })
      .end((error) => {
        error ? done.fail(error) : done();
      });
  });
});
