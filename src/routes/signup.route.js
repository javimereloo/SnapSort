const DB = require("../database/db.config.js");

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
    preHandler: (request, reply, done) => {
      DB.getUsername(request.body.username, (error, username) => {
        if (error) {
          console.log(error);
        } else {
          reply.send("NOMBRE DE USUARIO YA EN USO"); //TODO manejar los errores en la vista
        }
      })
      if (request.body.password !== request.body.password) {
        reply.send("LAS CONTRASEÑAS NO COINCIDEN"); //TODO manejar los errores en la vista
      }
      done();
    },
    handler: (request, reply) => {
      const user = {
        name: request.body.username,
        password: request.body.password,
      };
      DB.insertUser(
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
