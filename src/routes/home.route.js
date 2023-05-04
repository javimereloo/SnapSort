const API = require("../database/API.js");
const googleAPI = require("../GoogleDrive/googleAPI.js");

function orderImagesBy(imagenes, orderBy) {
  if (orderBy === "score") {
    return imagenes.sort((a, b) => b.score - a.score);
  } else if (orderBy === "topic") {
    return imagenes.sort((a, b) => (a.topic || '').localeCompare(b.topic || ''));
  } 
  return imagenes;
}

function getTopics(images){
  const topics = new Set();

  for (let i = 0; i < images.length; i++) {
    if (images[i].topic) { // comprobar si el topic existe
      topics.add(images[i].topic);
    }
  }
  console.log('TOPICSSSS------------------>', topics)
  return Array.from(topics); 
}

module.exports = async function (fastify, opts) {
  fastify.route({
    method: "GET",
    url: "/home/:importID/:orderBy?",
    preHandler: (request, reply, done) => {
      //TODO COMPROBAR QUE EL IMPORTID CORRESPONDA AL USUARIO
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
      
      const topics = getTopics(images);
      
      const actualImport = importaciones.find((e) => e.importID == importID);
      const pageHeader = actualImport ? actualImport.nameFolder : "Galería";
      
      //Order images
      const orderBy = decodeURIComponent(request.query.orderBy);
      if(orderBy){
        images = orderImagesBy(images, orderBy);
      }
      

      // console.log("IMAGENES------------", images);
      return reply.view("/src/pages/home.hbs", {
        user: request.session.user,
        importaciones: importaciones,
        importacionesSize: importaciones.size,
        currentPage: importID,
        currentPageHeader: pageHeader,
        numImages: images.length,
        images: images,
        topics: topics, 
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
    url: "/home/delete/:importID",
    preHandler: (request, reply, done) => {
      // Comprobar si el usuario está autenticado
      if (!request.session.user) {
        const errorMessage = true;
        return reply.redirect(`/login?errorMessage=${errorMessage}`);
      }
      done();
    },
    handler: async (request, reply) => {
      const importID = decodeURIComponent(request.params.importID);
      API.deleteFolder(request.session.user.username, importID).catch(
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
      let url;
      try {
        url = new URL(request.body.url);
      } catch (error) {
        return reply
          .code(400)
          .send("No se ha proporcionado una URL válida", error);
      }

      if (url.hostname !== "drive.google.com") {
        return reply
          .code(400)
          .send("La url proporcionada no corresponde a Google Drive");
      } else {
        const importID = await API.insertImport(
          request.session.user.username,
          request.body.url
        )
          .then(async (importID) => {
            if (request.body.importationName) {
              API.changeImportName(
                request.session.user.username,
                importID,
                request.body.importationName
              );
            }
            const clientIp = request.headers["x-forwarded-for"] || request.ip;
            //Load and add images to DB
            await googleAPI.listFilesInFolder(
              request.body.url,
              importID,
              clientIp
            );
          })
          .catch((err) => {
            console.error("Ocurrió un error", err); //TODO mostrar alerta de error
          });
        return reply.redirect(`/home/${encodeURIComponent(importID)}`);
      }
    },
  });
};
