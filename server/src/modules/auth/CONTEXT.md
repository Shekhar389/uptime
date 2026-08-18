# Auth Module Context

## Domain Concepts
- **Signup**: Process of registering a new User identity. Every User MUST belong to an Organisation.
- **Organisation Association**:
  - *Existing Organisation*: User supplies `oid` to join an active existing organisation.
  - *New Organisation*: User supplies `org` details (`name`, optional `logo`, optional `description`). A unique human-readable `oid` is automatically generated (e.g. `acme-x9k2p`).
- **Authentication Token**: A symmetric HS256 JWT signed with `JWT_SECRET`, returned upon successful signup/login.

## Module Boundaries
- Public seam exposed via `server/src/modules/auth/index.ts`.
- External code MUST NOT import from `server/src/modules/auth/internal/*`.
