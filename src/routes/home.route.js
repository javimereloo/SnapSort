const DB = require("../database/db.config.js");
const API = require("../database/API.js");
const googleAPI = require("../GoogleDrive/googleAPI.js");

//Returns is the recieved route is the actual route
function isActive(route) {
  return this.request.url === route;
}

module.exports = async function (fastify, opts) {
  fastify.route({
    method: "GET",
    url: "/home/:importID",
    preHandler: (request, reply, done) => {
      if (!request.session.user) {
        const errorMessage = true;
        return reply.redirect(`/login?errorMessage=${errorMessage}`);
      }
      done();
    },
    handler: async (request, reply) => {
      const importaciones = JSON.parse(
        await API.getImportaciones(request.session.user.username)
      );

      const importID = decodeURIComponent(request.params.importID);
      let images = [];

      if (importID === "") {
        const pics = await API.getAllImages(request.session.user.username);
        images = JSON.parse(pics);
      } else {
        const pics = await API.getImagesFromImport(
          request.session.user.username,
          importID
        );
        images = JSON.parse(pics);
      }

      const actualImport = importaciones.find((e) => e.importID == importID);
      const pageHeader = actualImport ? actualImport.nameFolder : "Galería";
      return reply.view("/src/pages/home.hbs", {
        user: request.session.user,
        importaciones: importaciones,
        importacionesSize: importaciones.size,
        currentPage: importID,
        currentPageHeader: pageHeader,
        numImages: images.length,
        images: images,
      });
    },
  });

  fastify.route({
    method: "GET",
    url: "/home",
    handler: (request, reply) => {
      return reply.redirect("/home/");
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
      API.deleteFolder(request.session.user.username, folderName).catch(
        (error) => {
          reply.send("Error eliminando:", error);
        }
      );
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
      const url = new URL(request.body.url);
      console.log('url hostname======>', url.hostname)
      if (url.hostdrive.google.com)) {
        return reply.code(400).send('La url proporcionada no existe');
      } else {
        const importID = await API.insertImport(
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
            const clientIp = request.headers["x-forwarded-for"] || request.ip;
            console.log("CLIENT IP====>", clientIp);
            //Load and add images to DB
            googleAPI.listFilesInFolder(request.body.url, importID, clientIp);
          })
          .catch((err) => {
            console.error("Ocurrió un error", err); //TODO mostrar alerta de error
          });
        return reply.redirect(
          `/home/${encodeURIComponent(importID)}`
        );
      }
    },
  });
};
