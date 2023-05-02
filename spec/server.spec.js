const request = require("supertest");
const app   = require("../server.js");
// const server = fastify.server;

// describe("Probando rutas servidor ", () => {
//   // it('GET / returns status 200', async () => {
//   //   const response = await supertest(fastify).get('/');
//   //   expect(response.statusCode).toBe(200);
//   // });
  
//   it("should return login page", async (done) => {
//     const response = await supertest(server).get("/login");
//     expect(response.statusCode).toBe(200);
//     // .end((err, res) => {
//     //     if (err) return done.fail(err);
//     //     done();
//     //   });
//     done();
//   });
// });

describe('GET /', () => {
  it('should return a message with "Hola, mundo!"', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Hola, mundo!');
  });
});

 // afterAll((done) => {
 //    server.close(done);
 //  });
