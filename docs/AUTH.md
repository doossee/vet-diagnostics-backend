# Authentication & Authorization

## Overview

The system uses JWT-based authentication with two-token rotation:
- **Access token** — short-lived (default: 15 minutes), sent with every API request
- **Refresh token** — long-lived (default: 7 days), used only to get new token pairs

Refresh tokens are never stored in plain text. Only a SHA256 hash is persisted in `User.refreshTokenHash`. On each refresh, the old token is invalidated and a new pair is issued.

---

## Roles

```typescript
enum UserRole {
  SUPER_ADMIN   // Full access to everything
  ADMIN         // All management operations, admin CRUD
  VETERINARIAN  // Exam creation, session submission, feedback
  FARMER        // View own animals and sessions
}
```

Role is embedded in the JWT payload and checked by `RolesGuard` on protected endpoints.

---

## Token Flow

### 1. Login
```
POST /auth/login  { username, password }
         │
         ▼
AuthService.login()
  ├── Query user by username
  ├── Check isActive && !deletedAt
  ├── bcrypt.compare(password, user.password)
  ├── Generate accessToken (JWT, signed with JWT_ACCESS_SECRET)
  ├── Generate refreshToken (JWT, signed with JWT_REFRESH_SECRET)
  ├── Hash refreshToken with SHA256
  ├── Store hash in User.refreshTokenHash
  ├── Store expiry in User.tokenExpiresAt
  └── Return { accessToken, refreshToken, userId, role }
```

### 2. Authenticated Request
```
GET /any-protected-endpoint
  Authorization: Bearer <accessToken>
         │
         ▼
JwtAuthGuard (Passport JWT strategy)
  ├── Extracts token from Authorization header
  ├── Verifies signature using JWT_ACCESS_SECRET
  ├── Checks expiry
  └── Attaches payload to request.user
         │
         ▼
Controller handler receives req.user as CurrentUserEntity
```

### 3. Token Refresh
```
POST /auth/refresh
  Authorization: Bearer <refreshToken>
         │
         ▼
AuthService.refresh()
  ├── Decode and verify refreshToken (JWT_REFRESH_SECRET)
  ├── Query user by sub (userId)
  ├── SHA256 hash incoming token
  ├── Compare to stored User.refreshTokenHash
  ├── Check User.tokenExpiresAt not expired
  ├── Generate new accessToken + refreshToken
  ├── Update User.refreshTokenHash and tokenExpiresAt
  └── Return { accessToken, refreshToken }
```

### 4. Logout
```
POST /auth/logout  { refreshToken }
         │
AuthService.logout()
  └── Clears User.refreshTokenHash  (single device)

POST /auth/logout-all
         │
AuthService.logoutAll(userId)
  └── Clears all tokens for every device
```

---

## Guards

### JwtAuthGuard (`src/auth/guards/jwt-auth.guard.ts`)
Extends `AuthGuard('jwt')` from Passport. Validates the access token in the `Authorization: Bearer` header. Returns 401 if token is missing, malformed, or expired.

### RolesGuard (`src/auth/guards/roles.guard.ts`)
Extends `JwtAuthGuard`. After JWT validation succeeds, checks `request.user.role` against the array of roles stored in route metadata. Returns 403 if the role does not match.

---

## Decorators

### `@IsAuthenticated()`
Applies `JwtAuthGuard` and sets Swagger 401 documentation on the endpoint.

```typescript
// Usage on controller method:
@IsAuthenticated()
@Get(':id')
findOne(@Param('id') id: string) { ... }
```

### `@IsAdminUser()`
Applies `JwtAuthGuard` + `RolesGuard([UserRole.ADMIN, UserRole.SUPER_ADMIN])`. Sets Swagger 401 and 403 documentation.

```typescript
@IsAdminUser()
@Delete(':id')
remove(@Param('id') id: string) { ... }
```

### `@Public()`
Marks an endpoint as explicitly public (no auth required). Used for login, refresh, and any other unauthenticated routes.

```typescript
@Public()
@Post('login')
login(@Body() dto: LoginDto) { ... }
```

### `@GetCurrentUser()`
Parameter decorator. Extracts the authenticated user from `request.user` and injects it as a typed `CurrentUserEntity` into the controller method.

```typescript
@IsAuthenticated()
@Get('me')
getProfile(@GetCurrentUser() user: CurrentUserEntity) {
  return user; // { id, username, role, ... }
}
```

---

## JWT Payload Structure

```typescript
// Access token payload
{
  sub: string;      // User.id
  username: string;
  role: UserRole;
  iat: number;      // Issued at
  exp: number;      // Expires at
}
```

---

## CurrentUserEntity

The typed object attached to every authenticated request:

```typescript
class CurrentUserEntity {
  id: string;
  username: string;
  role: UserRole;
}
```

---

## Security Properties

| Property | Implementation |
|---|---|
| Password storage | bcrypt with salt rounds |
| Refresh token storage | SHA256 hash only — plain token never stored |
| Token rotation | Every refresh call invalidates the previous refresh token |
| Multi-device logout | `logoutAll()` clears the hash, invalidating all devices simultaneously |
| Account suspension | `isActive = false` prevents login without deleting the record |
| Soft delete | `deletedAt` prevents login while preserving audit history |

---

## Environment Variables

```bash
JWT_ACCESS_SECRET=minimum-32-character-secret-string
JWT_REFRESH_SECRET=different-minimum-32-character-secret
JWT_ACCESS_EXPIRE=15m     # ms library format: 15m, 1h, 7d
JWT_REFRESH_EXPIRE=7d
```

Both secrets must be at least 32 characters. The application will throw at startup if they are missing (via `ConfigService.getOrThrow()`).

---

## User Profiles

A User record alone does not carry role-specific data. Role-specific extensions are created as separate profile records:

```
User (id, role: VETERINARIAN)
 └── VetProfile (id = User.id, licenseNumber, specialization, experience)
      └── farmers[]  (FarmerProfiles linked to this vet)

User (id, role: FARMER)
 └── FarmerProfile (id = User.id, veterinarianId, farmName, farmSize)
      └── animals[]  (Animal records owned by this farmer)
```

Profile creation is handled separately from user creation. A user may exist without a profile if the profile setup step has not been completed.
