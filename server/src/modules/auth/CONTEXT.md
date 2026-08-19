# Auth Module Context

## Domain Concepts
- **Signup**: Process of registering a new User identity. Every User MUST belong to an Organisation.
- **Login**: Process of authenticating an existing User with email and password. Verifies credentials against stored password hash and ensures Organisation status is active before issuing an Authentication Token.
- **Organisation Association**:
  - *Existing Organisation*: User supplies `oid` to join an active existing organisation.
  - *New Organisation*: User supplies `org` details (`name`, optional `logo`, optional `description`). A unique human-readable `oid` is automatically generated (e.g. `acme-x9k2p`).
- **Authentication Token**: A symmetric HS256 JWT signed with `JWT_SECRET`, returned upon successful signup/login containing `userId` and `organisationId`.
- **Authenticated Request Context**: Invariant where protected API routes authenticate incoming requests via `Authorization: Bearer <token>` and populate the request context with verified User and Organisation identifiers.

## Module Boundaries
- Public seam exposed via `server/src/modules/auth/index.ts`.
- External code MUST NOT import from `server/src/modules/auth/internal/*`.
