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

// Allow us use JWT 
fastify.register(require('@fastify/jwt'), {
  secret: 'saliddeprisaaunanuevatierra'
})

// Our main GET home page route, pulls from src/pages/index.hbs
fastify.get("/", function (request, reply) {
  let params = {
    title: "Bienvenido",
    subtitle: "Regístrate o inicia sesión para visualizar tus imágenes"
  };
  // request.query.paramName <-- a querystring example
  return reply.view("/src/pages/index.hbs", params);
});

// A POST route to handle form submissions
fastify.post("/", function (request, reply) {
  let params = {
    title: "Bienvenido",
    subtitle: "Regístrate o inicia sesión para visualizar tus imágenes"
  };
  // request.body.paramName <-- a form post example
  return reply.view("/src/pages/index.hbs", params);
});

// A POST route to handle form submissions
fastify.post("/login", async (request, reply) {
  let params = {
    title: "Bienvenido",
    subtitle: "Regístrate o inicia sesión para visualizar tus imágenes"
  };
  // request.body.paramName <-- a form post example
  return reply.view("/src/pages/index.hbs", params);
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
