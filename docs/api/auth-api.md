# Auth Module API Documentation

## Overview
The Authentication module handles user registration, identity verification, organisation binding, and JWT session token generation.

Base URL: `/api/v1/auth`

---

## Endpoints

### 1. User & Organisation Signup
Registers a new user into an organisation. Supports two scenarios:
1. **Join Existing Organisation**: User provides `oid`.
2. **Create New Organisation**: User provides `org` object (`name`, optional `logo`, optional `description`).

- **Method**: `POST`
- **Path**: `/api/v1/auth/signup`
- **Content-Type**: `application/json`

#### Request Headers
| Header | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `Content-Type` | `string` | Yes | Must be `application/json` |

#### Request Payload DTO (`SignupRequestDTO`)

##### Scenario 1: Join Existing Organisation (`SignupJoinExistingOrgDTO`)
```json
{
  "email": "jane.doe@example.com",
  "name": "Jane Doe",
  "password": "securePassword123",
  "oid": "acme-x9k2p"
}
```

##### Scenario 2: First-Time User with New Organisation (`SignupCreateNewOrgDTO`)
```json
{
  "email": "john.founder@startup.com",
  "name": "John Founder",
  "password": "securePassword123",
  "org": {
    "name": "Startup Inc",
    "logo": "https://startup.com/logo.png",
    "description": "Innovative SaaS Platform"
  }
}
```

#### Field Validation Rules
| Field | Type | Required | Constraints / Rules |
| :--- | :--- | :--- | :--- |
| `email` | `string` | Yes | Valid email format. Unique across database. |
| `name` | `string` | Yes | Min 1 char, max 255 chars. |
| `password` | `string` | Yes | Min 8 chars. Hashed with scrypt before storage. |
| `oid` | `string` | Scenario 1 | Valid, existing `oid` string. Target org must be `active`. |
| `org` | `object` | Scenario 2 | Object containing `name` (required, max 255), `logo` (optional, max 255), `description` (optional, max 1000). |

---

#### Success Response (`SignupResponseDTO`)
- **Status Code**: `201 Created`
- **Body**:
```json
{
  "user": {
    "id": "c1f3b89e-4e6a-4d2b-9f1c-1a2b3c4d5e6f",
    "email": "john.founder@startup.com",
    "name": "John Founder",
    "organisationId": "d2e4f5a6-7b8c-9d0e-1f2a-3b4c5d6e7f8a",
    "createdAt": "2026-08-18T09:27:00.000Z"
  },
  "organisation": {
    "id": "d2e4f5a6-7b8c-9d0e-1f2a-3b4c5d6e7f8a",
    "name": "Startup Inc",
    "logo": "https://startup.com/logo.png",
    "description": "Innovative SaaS Platform",
    "oid": "startupinc-x9k2p",
    "status": "active"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### Error Responses

##### `400 Bad Request` — Validation Failure
Occurs if request payload violates Zod schema rules or omits both `oid` and `org`.
```json
{
  "error": "Validation error: Invalid email address, Password must be at least 8 characters long",
  "statusCode": 400,
  "timestamp": "2026-08-18T09:27:00.000Z"
}
```

##### `403 Forbidden` — Inactive Organisation
Occurs when trying to join an organisation set to `status: "inactive"`.
```json
{
  "error": "Organisation is inactive.",
  "statusCode": 403,
  "timestamp": "2026-08-18T09:27:00.000Z"
}
```

##### `404 Not Found` — Organisation Not Found
Occurs when `oid` is supplied but does not match any existing organisation.
```json
{
  "error": "Organisation with given oid not found.",
  "statusCode": 404,
  "timestamp": "2026-08-18T09:27:00.000Z"
}
```

##### `409 Conflict` — Email Already in Use
Occurs when the supplied email is already registered in PostgreSQL.
```json
{
  "error": "User with this email already exists.",
  "statusCode": 409,
  "timestamp": "2026-08-18T09:27:00.000Z"
}
```
