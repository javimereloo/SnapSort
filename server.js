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

//Register handlebars necessary helpers
const handlebars = require('handlebars');
handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});
handlebars.registerHelper('toString', function (value) {
  return value.toString();
});
handlebars.registerHelper("encodeURIComponent", function(str) {
  return encodeURIComponent(str);
});
handlebars.registerHelper("decodeURIComponent", function(str) {
  return decodeURIComponent(str);
});

//Import routes 
fastify.register(require('./src/routes/index.route.js'))
fastify.register(require('./src/routes/login.route.js'))
fastify.register(require('./src/routes/home.route.js'))
fastify.register(require('./src/routes/signup.route.js'))
fastify.register(require('./src/routes/logout.route.js'))


//Configuration for session identification
const fastifySession = require("@fastify/session");
const fastifyCookie = require("@fastify/cookie");
fastify.register(fastifyCookie);
fastify.register(fastifySession, {
  secret: process.env.SECRET_KEY,
  cookie: {
    secure: false,
    maxAge: 14400000, // Tiempo de expiración de la cookie 4h
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
    console.log(`La aplicación está activa en ${address}`);
  }
);

module.exports = {fastify}; 