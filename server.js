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

// Our main GET home page route, pulls from src/pages/index.hbs
fastify.get("/", function (request, reply) {
  let params = {
    title: "Bienvenido",
    subtitle: "Regístrate o inicia sesión para visualizar tus imágenes",
  };
  // request.query.paramName <-- a querystring example
  return reply.view("/src/pages/index.hbs", params);
});

// A POST route to handle form submissions
fastify.post("/", function (request, reply) {
  let params = {
    title: "Bienvenido",
    subtitle: "Regístrate o inicia sesión para visualizar tus imágenes",
  };
  // request.body.paramName <-- a form post example
  return reply.view("/src/pages/index.hbs", params);
});

//A route method that handle user login 
fastify.route({
  method: "GET",
  url: "/login",
  preHandler: (request, reply, done) => {
    // Comprobar si el usuario está autenticado
    if (!request.session.user) {
      // Devolver un error si el usuario no está autenticado
      // return done(new Error("Ya se ha iniciado sesión"));
    }
    // Continuar con la solicitud si el usuario está autenticado
    done();
  },
  handler: (request, reply) => {
    return reply.view("/src/pages/login.hbs")
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
    if (request.session.user) {
       return done(new Error('Ya se ha iniciado sesión'))
    }
    done()
  },
  handler: (request, reply) => {
    const user = {
      name: request.body.username,
      password: request.body.password,
    };
    request.session.user = user;
    reply.view("/src/pages/main.hbs", user)
    
  },
});

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

//THING TO DO SEESSION identification
const fastifySession = require("@fastify/session");
const fastifyCookie = require("@fastify/cookie");
fastify.register(fastifyCookie);
fastify.register(fastifySession, {
  secret: "a secret with minimum length of 32 characters",
  cookieName: "sessionId",
  cookie: {
    secure: true,
    maxAge: 7200000, // Tiempo de expiración de la cookie
  },
  saveUninitialized: true,
});
// //Hook that assigns a session user name
// fastify.addHook('preHandler', (request, reply, next) => {
//   request.session.user = {name: 'max'}; //TODO AQUI TIENE QUE ASIGNAR sessionID NO?
//   next();
// })

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
