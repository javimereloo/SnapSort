const API = require("../database/API.js");

module.exports = async function (fastify, opts) {
  //A route method that handle user login
  fastify.route({
    method: "GET",
    url: "/login",
    preHandler: (request, reply, done) => {
      // Comprobar si el usuario está autenticado
      // if (request.session.user) {
      //   // Devolver un error si el usuario no está autenticado
      //   console.log(`Ya se ha iniciado sesión con ${request.session.user}`)
      //   return done(new Error("Ya se ha iniciado sesión"));
      // }
      // Continuar con la solicitud si el usuario está autenticado
      done();
    },
    handler: (request, reply) => {
      return reply.view("/src/pages/login.hbs");
    },
  });

  //A route method that handle user login
  fastify.route({
    method: "POST",
    url: "/login",
    preHandler: async (request, reply, done) => {
      const correctCredentials = await API.checkPassword(request.body.username, request.body.password);
      if (!correctCredentials) {
        const errorPassword = "Credenciales incorrectas"
        const templateData = { errorPassword, username:request.body.username};
        return reply.view("/src/pages/login.hbs", templateData); 
      }
      done();
    },
    handler: async (request, reply) => {
      const userinfo = await API.getUserdata(request.body.username)
      const user = {
        username: request.body.username,
        name:  userinfo.info,
        lastname: userinfo.info,
        password: request.body.password,
      };
      request.session.user = user;
      reply.redirect("/p", {query: user});
    },
  });
};
