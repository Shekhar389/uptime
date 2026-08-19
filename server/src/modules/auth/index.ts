export { authRoutes } from './internal/routes.js';
export { AuthService } from './internal/service.js';
export { verifyJwt, signJwt } from './internal/utils/crypto.js';
export { signupSchema, loginSchema } from './internal/schemas.js';
export type { SignupInput, LoginInput } from './internal/schemas.js';
export type {
  SignupRequestDTO,
  SignupJoinExistingOrgDTO,
  SignupCreateNewOrgDTO,
  SignupResponseDTO,
  LoginRequestDTO,
  LoginResponseDTO,
  UserDTO,
  OrganisationDTO,
} from './internal/dto.js';
