const supertest = require("supertest");
const server   = require("../server.js");

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
