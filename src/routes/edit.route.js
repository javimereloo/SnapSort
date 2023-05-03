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
      if(!API.getOwner(imagenID) === request.session.user.username){
        return reply.redirect('/home');
      }
      done();
    },
    handler: async (request, reply) => {
      const imagenID = decodeURIComponent(request.params.imagenID);
      let imageInfo;
      await API.getImageInfo(imagenID);
      return reply.view("/src/pages/edit.hbs", {
        user: request.session.user,
        imagenInfo:imageInfo,
      });
    },
  });
};
