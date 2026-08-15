import { FastifyInstance } from 'fastify';

export async function authRouter(fastify: FastifyInstance) {
  fastify.post('/login', async (request, reply) => {
    return reply.send({ message: 'Login successful', token: 'mock-jwt-token' });
  });

  fastify.post('/logout', async (_request, reply) => {
    return reply.send({ message: 'Logged out successfully' });
  });
}
