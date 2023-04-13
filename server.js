const path = require("path");

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // set this to true for detailed logging:
  logger: true,
});

// Setup our static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});

// fastify-formbody lets us parse incoming forms
fastify.register(require("@fastify/formbody"));

// point-of-view is a templating manager for fastify
fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

fastify.register(require('./src/routes/index.route.js'))
fastify.register(require('./src/routes/login.route.js'))


//Route to acccess register view
fastify.route({
  method: "GET",
  url: "/logout",
  preHandler: (request, reply, done) => {
    // Comprobar si el usuario está autenticado
    if (!request.session.user) {
      return reply.redirect("/");
    }
     reply.session.destroy()
  },
  handler: (req, reply) => {
    // Manejar la solicitud del perfil del usuario
    return reply.view("/");
  },
});

//Route to acccess register view
fastify.route({
  method: "GET",
  url: "/signup",
  preHandler: (request, reply, done) => {
    // Comprobar si el usuario está autenticado
    if (!request.session.user) {
      // Devolver un error si el usuario no está autenticado
      console.log("SESSION");
      console.log(request.session);
      return reply.redirect("/");
    }
    console.log("SESSION");
    console.log(request.session);
    // Continuar con la solicitud si el usuario está autenticado
    done();
  },
  handler: (req, reply) => {
    // Manejar la solicitud del perfil del usuario
    return reply.view("/src/pages/register.hbs");
  },
});

fastify.route({
  method: "GET",
  url: "/p",
  preHandler: (request, reply, done) => {
    // Comprobar si el usuario está autenticado
    if (!request.session.user) {
      // Devolver un error si el usuario no está autenticado
      return done(new Error("No se ha iniciado sesión"));
    }
    // Continuar con la solicitud si el usuario está autenticado
    done();
  },
  handler: (request, reply) => {
    return reply.view("/src/pages/main.hbs");
  },
});

//THINGs TO DO SEESSION identification
const fastifySession = require("@fastify/session");
const fastifyCookie = require("@fastify/cookie");
fastify.register(fastifyCookie);
fastify.register(fastifySession, {
  secret: process.env.SECRET_KEY,
  cookieName: "sessionId",
  cookie: {
    secure: true,
    maxAge: 7200000, // Tiempo de expiración de la cookie
  },
  saveUninitialized: true,
});
fastify.addHook('preHandler', (request, _reply, next) => {
  if (!request.session.sessionData) {
    request.session.sessionData = { userId: String, name: String, email: String, password: String, loggedOn: Date }
  }
  next()
})


// Run the server and report out to the logs
fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
