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
    url: "/signuo",
    preHandler: (request, reply, done) => {
      //TODO comprobar si el nombre usuario ya existe
      //TODO comprobar que las contraseñas coincidan
      done();
    },
    handler: (request, reply) => {
      const user = {
        name: request.body.username,
        password: request.body.password,
      };
      request.session.user = user;
      return reply.redirect("/p");
    },
  });
};
