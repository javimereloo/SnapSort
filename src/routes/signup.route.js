const API = require("../database/API.js");

module.exports = async function (fastify, opts) {
  //Route to acccess register view
  fastify.route({
    method: "GET",
    url: "/signup",
    preHandler: (request, reply, done) => {
      // Comprobar si el usuario está autenticado
      if (request.session.user) {
        // Devolver un error si el usuario  está autenticado
        console.log("Usuario ya registrado");
        console.log(request.session);
        return reply.redirect("/");
      }
      // Continuar con la solicitud si el usuario no está autenticado
      done();
    },
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
        const errorUsername = "Nombre de usuario ya en uso"
        const templateData = {errorUsername, name:request.body.name, lastname:request.body.lastname, email: request.body.email};
        return reply.view("/src/pages/register.hbs", templateData);  //TODO meter en el prehandler??
      }

      if (request.body.password !== request.body.repeatPassword) {
        const errorPassword = "Las contraseñas no coinciden"
        const templateData = { errorPassword, name:request.body.name, lastname:request.body.lastname, email: request.body.email };
        return reply.view("/src/pages/register.hbs", templateData); 
      }else if(Object.keys(request.body.password).length < 6){ //Basic security
        const errorPassword = "La contraseña debe ser mínimo de 6 caracteres"
        const templateData = {errorPassword, username:request.body.username, name:request.body.name, lastname:request.body.lastname, email: request.body.email };
        return reply.view("/src/pages/register.hbs", templateData); 
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
