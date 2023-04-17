module.exports = async function (fastify, opts) {
  // Our main GET home page route, pulls from src/pages/index.hbs
  fastify.get("/", function (request, reply) {
    return reply.view("/src/pages/index.hbs");
  });
};
