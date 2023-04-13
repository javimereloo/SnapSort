module.exports = async function (fastify, opts) {
  // Our main GET home page route, pulls from src/pages/index.hbs
  fastify.get("/", function (request, reply) {
    let params = {
      title: "Bienvenido",
      subtitle: "Regístrate o inicia sesión para visualizar tus imágenes",
    };
    
    return reply.view("/src/pages/index.hbs", params);
  });
};
