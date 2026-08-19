import { FastifyInstance } from 'fastify';
import { AuthController } from './controller.js';

export async function authRoutes(fastify: FastifyInstance) {
  const controller = new AuthController();

  fastify.post(
    '/signup',
    {
      schema: {
        tags: ['Authentication'],
        summary: 'User & Organisation Signup',
        description:
          'Registers a new user into an existing organisation (via oid) or creates a new organisation along with the user account.',
        body: {
          type: 'object',
          required: ['email', 'name', 'password'],
          properties: {
            email: { type: 'string', format: 'email', description: 'User email address' },
            name: { type: 'string', minLength: 1, maxLength: 255, description: 'User full name' },
            password: { type: 'string', minLength: 8, description: 'User password' },
            oid: { type: 'string', description: 'Existing organisation identifier (Scenario 1)' },
            org: {
              type: 'object',
              description: 'New organisation details (Scenario 2)',
              required: ['name'],
              properties: {
                name: { type: 'string', minLength: 1, maxLength: 255 },
                logo: { type: 'string', nullable: true },
                description: { type: 'string', nullable: true },
              },
            },
          },
        },
        response: {
          201: {
            type: 'object',
            description: 'User and Organisation created successfully',
            properties: {
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  email: { type: 'string' },
                  name: { type: 'string' },
                  organisationId: { type: 'string', format: 'uuid' },
                  createdAt: { type: 'string', format: 'date-time' },
                },
              },
              organisation: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  name: { type: 'string' },
                  logo: { type: 'string', nullable: true },
                  description: { type: 'string', nullable: true },
                  oid: { type: 'string', nullable: true },
                  status: { type: 'string' },
                },
              },
              token: { type: 'string', description: 'Symmetric HS256 JWT access token' },
            },
          },
          400: {
            type: 'object',
            description: 'Validation Error',
            properties: {
              error: { type: 'string' },
              statusCode: { type: 'number', example: 400 },
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
          403: {
            type: 'object',
            description: 'Inactive Organisation',
            properties: {
              error: { type: 'string' },
              statusCode: { type: 'number', example: 403 },
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
          404: {
            type: 'object',
            description: 'Organisation Not Found',
            properties: {
              error: { type: 'string' },
              statusCode: { type: 'number', example: 404 },
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
          409: {
            type: 'object',
            description: 'Email Already In Use',
            properties: {
              error: { type: 'string' },
              statusCode: { type: 'number', example: 409 },
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
    controller.signup
  );

  fastify.post(
    '/login',
    {
      schema: {
        tags: ['Authentication'],
        summary: 'User Login',
        description: 'Authenticates a user using email and password, returning the user, organisation details, and a JWT access token.',
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', description: 'User email address' },
            password: { type: 'string', minLength: 1, description: 'User password' },
          },
        },
        response: {
          200: {
            type: 'object',
            description: 'User authenticated successfully',
            properties: {
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  email: { type: 'string' },
                  name: { type: 'string' },
                  organisationId: { type: 'string', format: 'uuid' },
                  createdAt: { type: 'string', format: 'date-time' },
                },
              },
              organisation: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  name: { type: 'string' },
                  logo: { type: 'string', nullable: true },
                  description: { type: 'string', nullable: true },
                  oid: { type: 'string', nullable: true },
                  status: { type: 'string' },
                },
              },
              token: { type: 'string', description: 'Symmetric HS256 JWT access token' },
            },
          },
          400: {
            type: 'object',
            description: 'Validation Error',
            properties: {
              error: { type: 'string' },
              statusCode: { type: 'number', example: 400 },
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
          401: {
            type: 'object',
            description: 'Invalid Credentials',
            properties: {
              error: { type: 'string' },
              statusCode: { type: 'number', example: 401 },
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
          403: {
            type: 'object',
            description: 'Inactive Organisation',
            properties: {
              error: { type: 'string' },
              statusCode: { type: 'number', example: 403 },
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
    controller.login
  );
}
