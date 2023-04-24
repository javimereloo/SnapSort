const DB = require("../database/db.config.js");
const API = require("../database/API.js");

function isActive(route) {
  return this.request.url === route;
}

module.exports = async function (fastify, opts) {
  fastify.route({
    method: "GET",
     url:"/home/:folderName",
    preHandler: (request, reply, done) => {
      // Comprobar si el usuario está autenticado
      if (!request.session.user) {
        const errorMessage = true;
        return reply.redirect(`/login?errorMessage=${errorMessage}`);
      }
      done();
    },
    handler: async (request, reply) => {
      const importaciones = await API.getImportaciones(request.session.user.username);
      const {currentPage} = request.params;
      const value = currentPage || "Galeria";
      const param = { 
        user: request.session.user,
        importaciones: importaciones,
        importacionesSize: importaciones.size,
        currentPage: value,
      };
      return reply.view("/src/pages/home.hbs", param);
    },
  });
  

  
  //Route to add a new importation 
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
              request.session.user.username,
              request.body.url,
              request.body.importationName
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
