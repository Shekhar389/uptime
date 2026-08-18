import { FastifyRequest, FastifyReply } from 'fastify';
import { signupSchema } from './schemas.js';
import { AuthService } from './service.js';
import { SignupResponseDTO } from './dto.js';
import { AppError } from '../../../shared/errors/app-error.js';

export class AuthController {
  constructor(private readonly authService: AuthService = new AuthService()) {}

  signup = async (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> => {
    const parseResult = signupSchema.safeParse(request.body);
    if (!parseResult.success) {
      const issueMessage = parseResult.error.issues.map((i) => i.message).join(', ');
      throw new AppError(`Validation error: ${issueMessage}`, 400);
    }

    const responseDto: SignupResponseDTO = await this.authService.signup(parseResult.data);
    return reply.status(201).send(responseDto);
  };
}
