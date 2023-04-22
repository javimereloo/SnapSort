const API = require("../database/API.js");

module.exports = async function (fastify, opts) {
  //Route to acccess register view
  fastify.route({
    method: "GET",
    url: "/signup",
    preHandler: (request, reply, done) => {
      if (request.session.user) {
        //Close the user session if he's authenticted
        request.session.destroy();
      }
      done();
    },
    handler: (req, reply) => {
      return reply.view("/src/pages/register.hbs");
    },
  });

  fastify.route({
    method: "POST",
    url: "/signup",
    handler: async (request, reply) => {
      //First we check if any error occurred
      const username = await API.getUsername(request.body.username);
      if (username) {
        const errorUsername = "Nombre de usuario ya en uso";
        const templateData = {
          errorUsername,
          name: request.body.name,
          lastname: request.body.lastname,
          email: request.body.email,
        };
        return reply.view("/src/pages/register.hbs", templateData); //TODO meter en el prehandler??
      }

      if (request.body.password !== request.body.repeatPassword) {
        const errorPassword = "Las contraseñas no coinciden";
        const templateData = {
          errorPassword,
          name: request.body.name,
          lastname: request.body.lastname,
          email: request.body.email,
        };
        return reply.view("/src/pages/register.hbs", templateData);
      } else if (
        Object.keys(request.body.password).length < process.env.MINIMUN_LENGTH
      ) {
        //Basic security
        const errorPassword = `La contraseña debe ser mínimo de ${process.env.MINIMUN_LENGTH} caracteres`;
        const templateData = {
          errorPassword,
          username: request.body.username,
          name: request.body.name,
          lastname: request.body.lastname,
          email: request.body.email,
        };
        return reply.view("/src/pages/register.hbs", templateData);
      }
      
      try {
        API.insertUser(
          request.body.username,
          request.body.name,
          request.body.lastname,
          request.body.email,
          request.body.password
        );
      } catch (error) {
        reply.code(500).send("Error al crear usuario");
      }

      const user = {
        username: request.body.username,
        name: request.body.name,
        lastname: request.body.lastname,
      };
      request.session.user = user;
      return reply.redirect("/home");
    },
  });
};
