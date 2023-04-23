const supertest = require('supertest');
const assert = require('assert');
const fastify = require('../server.js');

describe('SERVIDOR : rutas ', () =>{
  describe('Rutas estáticas de proyectos', () => {
    it('should return login page', (done)=>{
      supertest(fastify)
      .get('/login')
      .expect(200)
      
    })
    
  })
  
})