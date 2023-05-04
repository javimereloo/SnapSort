const API = require("../database/API.js");

module.exports = async function (fastify, opts) {
  fastify.route({
    method: "GET",
    url: "/edit/:imagenID",
    preHandler: (request, reply, done) => {
      const imagenID = decodeURIComponent(request.params.imagenID);
      if (!request.session.user) {
        const errorMessage = true;
        return reply.redirect(`/login?errorMessage=${errorMessage}`);
      }
      if (
        !API.getImageOwner(imagenID) === request.session.user.username ||
        !imagenID
      ) {
        return reply.redirect("/home");
      }

      done();
    },
    handler: async (request, reply) => {
      const imagenID = decodeURIComponent(request.params.imagenID);
      let imagenInfo;
      await API.getImageInfo(imagenID)
        .then((imageInfo) => {
          imagenInfo = imageInfo;
        })
        .catch((err) => {
          console.error(err);
        });
      return reply.view("/src/pages/edit.hbs", {
        user: request.session.user,
        imagenInfo: imagenInfo,
      });
    },
  });
  fastify.route({
    method: "POST",
    url: "/edit/:imagenID",
    preHandler: (request, reply, done) => {
      const imagenID = decodeURIComponent(request.params.imagenID);
      if (!request.session.user) {
        const errorMessage = true;
        return reply.redirect(`/login?errorMessage=${errorMessage}`);
      }
      if (
        !API.getImageOwner(imagenID) === request.session.user.username ||
        !imagenID
      ) {
        return reply.redirect("/home");
      }
      done();
    },
    handler: async (request, reply) => {
      const imagenID = decodeURIComponent(request.params.imagenID);
      const imagenInfo = request.body;
      await API.changeImagenInfo(
        imagenID,
        imagenInfo.tituloImagen,
        imagenInfo.puntuacionImagen,
        imagenInfo.temaImagen
      ).catch((err) => {
        console.error(err);
      });
      return reply.redirect(`/edit/${imagenID}`);
      // reply.redirect(request.raw.url);
    },
  });
};
