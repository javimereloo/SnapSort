const API = require("../database/API.js");

module.exports = async function (fastify, opts) {
  //Route to logout a user
  fastify.route({
    method: "GET",
    url: "/logout",
    preHandler: (request, reply, done) => {
      // // Comprobar si el usuario está autenticado
      // if (!request.session.user) {
      //   return reply.redirect("/");
      // }
      // request.session.destroy();
      done();
    },
    handler: (request, reply) => {
      API.deleteUser(request.body.username)
      // Manejar la solicitud del perfil del usuario
      return reply.redirect("/");
    },
  });
};
