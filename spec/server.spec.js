const supertest = require("supertest");
const app  = require("../server.js");

describe("Probando rutas servidor ", () => {
  it("should return login page", (done) => {
    supertest(app)
    .get("/login")
    .expect(200)
    .end((err, res) => {
        if (err) return done.fail(err);
        done();
      });
  });
});
