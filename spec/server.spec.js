const supertest = require("supertest");
const app   = require("../server.js");
const server = app.server;

describe("Probando rutas servidor ", () => {
  it('GET / returns status 200', async () => {
    const response = await supertest(server).get('/');
    expect(response.statusCode).toBe(200);
  });
});


 // afterAll((done) => {
 //    server.close(done);
 //  });
