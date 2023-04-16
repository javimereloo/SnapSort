const API = require("../database/API.js");

module.exports = async function (fastify, opts) {
  //Route to acccess register view
  fastify.route({
    method: "GET",
    url: "/signup",
    // preHandler: (request, reply, done) => {
    //   // Comprobar si el usuario está autenticado
    //   if (!request.session.user) {
    //     // Devolver un error si el usuario no está autenticado
    //     console.log("SESSION");
    //     console.log(request.session);
    //     return reply.redirect("/");
    //   }
    //   console.log("SESSION");
    //   console.log(request.session);
    //   // Continuar con la solicitud si el usuario está autenticado
    //   done();
    // },
    handler: (req, reply) => {
      // Manejar la solicitud del perfil del usuario
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
        const errorMessage = "NOMBRE DE USUARIO YA EN USO"
        const templateData = { errorMessage };
        return reply.view("/src/pages/register.hbs", templateData); //TODO manejar los errores en la vista //TODO meter en el prehandler??
      }

      if (request.body.password !== request.body.repeatPassword) {
        const errorMessage = "LAS CONTRASEÑAS NO COINCIDEN"
        const templateData = { errorMessage };
        return reply.view("/src/pages/register.hbs", templateData); //TODO manejar los errores en la vista
      }

      const user = {
        name: request.body.username,
        password: request.body.password,
      };
      API.insertUser(
        //TODO MANEJAR EL ERROR, no devolver /p si el usuario no ha iniciado sesión
        request.body.username,
        request.body.name,
        request.body.lastname,
        request.body.email,
        request.body.password
      );
      request.session.user = user;
      return reply.redirect("/p");
    },
  });
};
