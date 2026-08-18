import { FastifyInstance } from 'fastify';
import { authRoutes } from '../../modules/auth/index.js';

export async function authRouter(fastify: FastifyInstance) {
  await fastify.register(authRoutes);

  fastify.post('/login', async (_request, reply) => {
    return reply.send({ message: 'Login successful', token: 'mock-jwt-token' });
  });

  fastify.post('/logout', async (_request, reply) => {
    return reply.send({ message: 'Logged out successfully' });
  });
}
