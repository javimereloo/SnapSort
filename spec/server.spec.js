const supertest = require("supertest");
const app = require("../server.js");
const server = app.server;

describe("Probando rutas servidor ", () => {
  it("GET / returns status 200", async (done) => {
    supertest(server)
      .get("/index")
      .expect(200)
      .expect(function (res) {
        console.log("BODY ACERCA DE ", res.body); // Para comprobar qué contiene exactamente res.body
      });
  });
});
