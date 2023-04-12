'use strict'
module.exports = async function (fastify, opts) {
    fastify.post('/signup', (req, reply) => {
        //TODO COMPROBAR CREDENCIALES 
        const token = fastify.jwt.sign({ "username": "Javi Merelo" })
        reply.send({ token })
        console.log("Aquí entra")
    })
  
   fastify.get(
        "/protected",
        {
            onRequest: [fastify.authenticate]
        },
        async function (request, reply) {
            return request.user
        }
    )
}