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
      if (!API.getOwner(imagenID) === request.session.user.username) {
        return reply.redirect("/home");
      }
      //TODO imagenID == null => home
      done();
    },
    handler: async (request, reply) => {
      const imagenID = decodeURIComponent(request.params.imagenID);
      let imagenInfo;
      await API.getImageInfo(imagenID)
        .then((imageInfo) => {
          imagenInfo = imageInfo;
          console.log(imagenInfo);
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
};
