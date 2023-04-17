const DB = require('../database/db.config.js')
require('../database/API.js')

module.exports = async function (fastify, opts) {
  fastify.route({
    method: "GET",
    url: "/p",
    preHandler: (request, reply, done) => {
      // Comprobar si el usuario está autenticado
      if (!request.session.user) {
        // Devolver un error si el usuario no está autenticado
        return done(new Error("No se ha iniciado sesión"));
      }
      // Continuar con la solicitud si el usuario está autenticado
      done();
    },
    handler: (request, reply) => {
      const param = request.query
      console.log("aqui me llega",  param)
      return reply.view("/src/pages/main.hbs",  param);
    },
  });
};
