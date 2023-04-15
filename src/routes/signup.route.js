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
    preHandler: async (request, reply, done) => {
      var _username = await API.getUsername(request.body.username, (error) => {
        if (error) {
          console.log(error);
        }
         // console.log('VALOR DE USERNAME: ', username)
        // _username = username
      });
      console.log('VALOR DE _USERNAME: ', _username)
      

      if (request.body.password !== request.body.repeatPassword) {
        return reply.code(500).send("LAS CONTRASEÑAS NO COINCIDEN"); //TODO manejar los errores en la vista
      }
      
      if (_username) {
        return reply.code(500).send("NOMBRE DE USUARIO YA EN USO"); //TODO manejar los errores en la vista
      }
      
      done();
    },
    handler: async (request, reply) => {
      const user = {
        name: request.body.username,
        password: request.body.password,
      };
      API.insertUser(
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
