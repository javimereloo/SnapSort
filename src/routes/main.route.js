const DB = require('../database/db.config.js')
require('../database/API.js')

module.exports = async function (fastify, opts) {
  fastify.route({
    method: "GET",
    url: "/p",
    preHandler: (request, reply, done) => {
      // Comprobar si el usuario está autenticado
      if (!request.session.user) {
        const errorMessage = "Por favor, regístrate o inicia sesión para visualizar este contenido"
        return reply.redirect(`/login?errorMessage=${errorMessage}`)
      }
      // Continuar con la solicitud si el usuario está autenticado
      done();
    },
    handler: (request, reply) => {
      const param = request.session.user
      return reply.view("/src/pages/main.hbs",  param);
    },
  });
};
