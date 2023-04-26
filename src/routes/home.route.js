const DB = require("../database/db.config.js");
const API = require("../database/API.js");
const googleAPI = require("../GoogleDrive/googleAPI.js");

function isActive(route) {
  return this.request.url === route;
}

module.exports = async function (fastify, opts) {
  fastify.route({
    method: "GET",
    url: "/home/:folderName",
    preHandler: (request, reply, done) => {
      // Comprobar si el usuario está autenticado
      if (!request.session.user) {
        const errorMessage = true;
        return reply.redirect(`/login?errorMessage=${errorMessage}`);
      }
      done();
    },
    handler: async (request, reply) => {
      const importaciones = await API.getImportaciones(
        request.session.user.username
      );
      const folderName = decodeURIComponent(request.params.folderName);
      const value = folderName || "Galeria";
      let images = [];

      if (value === "Galeria") {
        const pics = await API.getAllImages(request.session.user.username);
      } else {
        const pics = await API.getImagesFromImport(
          request.session.user.username,
          folderName
        );
        images = JSON.parse(pics);
      }
      return reply.view("/src/pages/home.hbs", {
        user: request.session.user,
        importaciones: importaciones,
        importacionesSize: importaciones.size,
        currentPage: value,
        numImages: images.length,
        images: images,
      });
    },
  });

  fastify.route({
    method: "GET",
    url: "/home/delete/:folderName",
    preHandler: (request, reply, done) => {
      // Comprobar si el usuario está autenticado
      if (!request.session.user) {
        const errorMessage = true;
        return reply.redirect(`/login?errorMessage=${errorMessage}`);
      }
      done();
    },
    handler: async (request, reply) => {
      const folderName = decodeURIComponent(request.params.folderName);
      API.deleteFolder(request.session.user.username, folderName)
        .catch((error) => {
           reply.send("Error eliminando:", error);
        });
        return reply.redirect("/home/");
    },
  });

  //Route to add a new importation
  fastify.route({
    method: "POST",
    url: "/home/new",
    preHandler: (request, reply, done) => {
      // Check if the user is authenticated 
      if (!request.session.user) {
        const errorMessage = true;
        return reply.redirect(`/login?errorMessage=${errorMessage}`);
      }
      done();
    },
    handler: async (request, reply) => {
      const importID = API.insertImport(
        request.session.user.username,
        request.body.url
      )
        .then((importID) => {
          if (request.body.importationName) {
            API.changeImportName(
              request.session.user.username,
              importID,
              request.body.importationName
            );
          }
          //Load and add images to DB
          googleAPI.listFilesInFolder(request.body.url, importID);
        })
        .catch((err) => {
          console.error("Ocurrió un error", err); //TODO mostrar alerta de error
        });

      reply.redirect("/home/"); //TODO redirigir a la página de nueva importacion
    },
  });
};
