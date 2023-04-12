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


fastify.get("/login", function (request, reply) {
  let params = {
    title: "Bienvenido",
    subtitle: "Regístrate o inicia sesión para visualizar tus imágenes",
  
  };
  // request.query.paramName <-- a querystring example
  return reply.view("/src/pages/login.hbs", params);
});

fastify.get("/signup", function (request, reply) {
  let params = {
    title: "Bienvenido",
    subtitle: "Regístrate o inicia sesión para visualizar tus imágenes",
  
  };
  // request.query.paramName <-- a querystring example
  return reply.view("/src/pages/register.hbs", params);
});




const fastifySession = require('fastify-session')

fastify.register(fastifySession, {
  secret: 'my-secret-key', // Cambiar por una clave segura
  cookie: {
    secure: true, // Cambiar a true si se usa HTTPS
    maxAge: 7200000 // Tiempo de expiración de la cookie
  }
})


fastify.get('/login', (req, reply) => {
  // Autenticar al usuario
  const user = authenticateUser(req.body.username, req.body.password)

  if (user) {
    // Establecer la información de sesión para el usuario
    req.session.user = user
    reply.send({ message: 'Inicio de sesión exitoso' })
  } else {
    reply.status(401).send({ message: 'Credenciales inválidas' })
  }
})

fastify.get('/perfil', (req, reply) => {
  // Comprobar si el usuario está autenticado
  if (req.session.user) {
    return reply.view("/src/pages/main.hbs");
  } else {
    // Redirigir al usuario a la página de inicio de sesión
    reply.redirect('/login')
  }
})

function authenticateUser(username, password) {
  // Autenticar al usuario con las credenciales proporcionadas
  // Devolver el usuario si las credenciales son válidas, null si no lo son
  const user = ["admin", "1234"]
  return user
}




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
