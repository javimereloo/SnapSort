module.exports = async function (fastify, opts) {
  //A route method that handle user login
  fastify.route({
    method: "GET",
    url: "/login",
    preHandler: (request, reply, done) => {
      // Comprobar si el usuario está autenticado
      if (request.session.user) {
        // Devolver un error si el usuario no está autenticado
        console.log(`Ya se ha iniciado sesión con ${request.session.user}`)
        return done(new Error("Ya se ha iniciado sesión"));
      }
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
    preHandler: (request, reply, done) => {
      //TODO Comprobar usuario y contraseña
      //Cifrar contraseña
      // Comprobar si el usuario está autenticado
      if (request.body.username != request.body.password) {
        return done(new Error("CREDENCIALES INCORRECTAS"));
      }
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
