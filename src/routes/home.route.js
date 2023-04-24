const DB = require('../database/db.config.js')
const API= require('../database/API.js')

module.exports = async function (fastify, opts) {
  fastify.route({
    method: "GET",
    url: "/home",
    preHandler: (request, reply, done) => {
      // Comprobar si el usuario está autenticado
      if (!request.session.user) {
        const errorMessage = true
        return reply.redirect(`/login?errorMessage=${errorMessage}`)
      }
      // // Continuar con la solicitud si el usuario está autenticado
      done();
    },
    handler: (request, reply) => {
      const param = request.session.user
      return reply.view("/src/pages/home.hbs",  param);
    },
  });
  
  fastify.route({
    method:"POST",
    url:"/home/new", 
    handler:  async (request, reply) => {
      API.insertImport(request.body.username, request.body.url);
      if(request.body.url){
        API.changeImportName();
      }
    }
  });
};
