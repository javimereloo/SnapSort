const API = require("../database/API.js");

module.exports = async function (fastify, opts) {
  //A route method that handle user login
  fastify.route({
    method: "GET",
    url: "/login",
    preHandler: (request, reply, done) => {
      // Logout the user before a new login
      if (request.session.user) {
        request.session.destroy();
      }
      done();
    },
    handler: (request, reply) => {
      if(request.query){
        const error = request.query
        return reply.view("/src/pages/login.hbs", error);
      }
      return reply.view("/src/pages/login.hbs");
    },
  });

  //A route method that handle user login
  fastify.route({
    method: "POST",
    url: "/login",
    preHandler: async (request, reply, done) => {
      const correctCredentials = await API.checkPassword(
        request.body.username,
        request.body.password
      );
      if (!correctCredentials) {
        const errorPassword = "Credenciales incorrectas";
        const templateData = { errorPassword, username: request.body.username };
        return reply.view("/src/pages/login.hbs", templateData);
      }
      done();
    },
    handler: async (request, reply) => {
      const userinfo = await API.getUserdata(request.body.username);
      const user = {
        username: request.body.username,
        name: userinfo.name,
        lastname: userinfo.lastname,
      };
      request.session.user = user;
      request.session.isAuthenticated = true;
      reply.redirect("/home");
    },
  });
};
