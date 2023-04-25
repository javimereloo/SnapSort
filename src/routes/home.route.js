const DB = require("../database/db.config.js");
const API = require("../database/API.js");
const googleAPI = require("../GoogleDrive/googleAPI.js");

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
      const folderName = decodeURIComponent(request.params.folderName); 
      const value = folderName || "Galeria";
      return reply.view("/src/pages/home.hbs", { 
        user: request.session.user,
        importaciones: importaciones,
        importacionesSize: importaciones.size,
        currentPage: value,
      });
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
      const importID = API.insertImport(request.session.user.username, request.body.url)
        .then(() => {
          if (request.body.importationName) {
            console.log('linea 53 home.route.js');
            API.changeImportName(
              request.session.user.username,
              request.body.url,
              request.body.importationName
            );
          }
          // console.log('El importID es', importID);
          googleAPI.listFilesInFolder(request.body.url, importID);
          
        })
        .catch((err) => {
          console.error("Ocurrió un error:", err); //TODO mostrar alerta de error
        });
      
      reply.redirect("/home/"); //TODO redirigir a la página de nueva importacion
    },
  });
};
