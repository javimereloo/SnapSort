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

//Import routes 
fastify.register(require('./src/routes/index.route.js'))
fastify.register(require('./src/routes/login.route.js'))
fastify.register(require('./src/routes/main.route.js'))
fastify.register(require('./src/routes/signup.route.js'))

//Route to logout a user
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
  handler: (request, reply) => {
    // Manejar la solicitud del perfil del usuario
    return reply.redirect("/");
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
