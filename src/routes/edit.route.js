const API = require("../database/API.js");

module.exports = async function (fastify, opts) {
  fastify.route({
    method: "GET",
    url: "/edit/:imagenID",
    preHandler: (request, reply, done) => { //TODO COMPROBAR QUE LA IMAGEN PERTENEZCA AL USUARIO 
      if (!request.session.user) {
        const errorMessage = true;
        return reply.redirect(`/login?errorMessage=${errorMessage}`);
      }
      done();
    },
    handler: async (request, reply) => {
      return reply.view("/src/pages/edit.hbs", {
        user: request.session.user,
        
      });
    },
  });
};
