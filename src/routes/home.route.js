const DB = require("../database/db.config.js");
const API = require("../database/API.js");

module.exports = async function (fastify, opts) {
  fastify.route({
    method: "GET",
    url: "/home",
    preHandler: (request, reply, done) => {
      // Comprobar si el usuario está autenticado
      if (!request.session.user) {
        const errorMessage = true;
        return reply.redirect(`/login?errorMessage=${errorMessage}`);
      }
      // // Continuar con la solicitud si el usuario está autenticado
      done();
    },
    handler: async (request, reply) => {
      const importaciones = await API.getImportaciones(request.session.user.username);
      console.log('EL map importaciones contiene', importaciones);
      console.log('prueba ', importaciones.size);
      const param = { 
        user: request.session.user,
        importaciones: importaciones 
      };
      return reply.view("/src/pages/home.hbs", param);
    },
  });

  fastify.route({
    method: "POST",
    url: "/home/new",
    preHandler: (request, reply, done) => {
      // Comprobar si el usuario está autenticado
      if (!request.session.user) {
        const errorMessage = true;
        return reply.redirect(`/login?errorMessage=${errorMessage}`);
      }
      // // Continuar con la solicitud si el usuario está autenticado
      done();
    },
    handler: async (request, reply) => {
      API.insertImport(request.session.user.username, request.body.url)
        .then(() => {
          if (request.body.importationName) {
            API.changeImportName(
              request.body.importationName,
              request.body.url,
              request.session.user.username
            );
          }
        })
        .catch((err) => {
          console.error("Ocurrió un error:", err); //TODO mostrar alerta de error
        });
      reply.redirect("/home");
    },
  });
};
