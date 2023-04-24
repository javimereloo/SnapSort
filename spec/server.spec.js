const supertest = require("supertest");
const fastify   = require("../server.js");
const server = fastify.server;



describe("Probando rutas servidor ", () => {
  it('GET / returns status 200', async () => {
    const response = await supertest(server).get('/');
    expect(response.statusCode).toBe(200);
  });
  
  // it("should return login page", async (done) => {
  //   const response = await supertest(server).get("/login");
  //   expect(response.statusCode).toBe(200);
  //   // .end((err, res) => {
  //   //     if (err) return done.fail(err);
  //   //     done();
  //   //   });
  //   done();
  // });
});

 afterAll((done) => {
    server.close(done);
  });
