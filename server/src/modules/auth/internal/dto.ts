export interface CreateNewOrgDetailsDTO {
  name: string;
  logo?: string | null;
  description?: string | null;
}

export interface SignupJoinExistingOrgDTO {
  email: string;
  name: string;
  password: string;
  oid: string;
}

export interface SignupCreateNewOrgDTO {
  email: string;
  name: string;
  password: string;
  org: CreateNewOrgDetailsDTO;
}

export type SignupRequestDTO = SignupJoinExistingOrgDTO | SignupCreateNewOrgDTO;

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  organisationId: string;
  createdAt: Date;
}

export interface OrganisationDTO {
  id: string;
  name: string;
  logo: string | null;
  description: string | null;
  oid: string | null;
  status: 'active' | 'inactive' | string;
}

export interface SignupResponseDTO {
  user: UserDTO;
  organisation: OrganisationDTO;
  token: string;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export type LoginResponseDTO = SignupResponseDTO;
