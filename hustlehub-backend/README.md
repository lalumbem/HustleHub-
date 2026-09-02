# HustleHub+ Backend — Secure Auth Foundation

A secure Node.js/Express API providing registration, login, JWT
authentication, input validation, HTTPS, and hardened error handling.
Built as the foundation of the HustleHub+ freelance marketplace (MERN
architecture); MongoDB and the React frontend come in later parts of the
project.

## What's here

```
hustlehub-backend/
├── src/
│   ├── config/validateEnv.js      # fails fast if .env is missing/unsafe
│   ├── controllers/authController.js
│   ├── middleware/
│   │   ├── authMiddleware.js      # verifies JWT on protected routes
│   │   ├── validationMiddleware.js
│   │   ├── rateLimiter.js         # throttles /register and /login
│   │   └── errorMiddleware.js     # generic errors + 404 handler
│   ├── models/userModel.js        # in-memory store (swap for Mongoose later)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   └── server.js
├── cert/                          # self-signed dev SSL cert (already generated)
├── .env.example                   # copy to .env
└── package.json
```

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Copy the example environment file and generate your own secret:
   ```
   cp .env.example .env
   npm run gen-secret
   ```
   Paste the generated value in as `JWT_SECRET` in `.env`. Don't reuse the
   value already in `.env.example` — it's committed to this deliverable and
   should be treated as burned.
3. A dev SSL certificate is already included under `cert/`. To regenerate it
   yourself:
   ```
   openssl req -x509 -newkey rsa:2048 -nodes -keyout cert/server.key -out cert/server.crt -days 365 -subj "/CN=localhost"
   ```
4. Run it:
   ```
   npm run dev
   ```
   You should see:
   ```
   HustleHub+ HTTPS API running on https://localhost:3000
   ```
   Your browser/Postman will warn about the self-signed cert — that's
   expected for local dev; accept it to proceed.

## Endpoints

| Method | Path                | Auth required | Notes                        |
|--------|---------------------|----------------|-------------------------------|
| POST   | /api/auth/register  | No             | Rate-limited                 |
| POST   | /api/auth/login     | No             | Rate-limited                 |
| GET    | /api/users/profile  | Yes (Bearer)   | Returns decoded JWT payload  |

### Register
```
POST https://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "mulweli lalumbe",
  "email": "mulweli@example.com",
  "password": "Password123",
  "role": "freelancer"
}
```

### Login
```
POST https://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "Mulweli@example.com",
  "password": "Password123"
}
```
Returns a `token` — use it as `Authorization: Bearer <token>` on
`/api/users/profile`.

## Test cases to run (and screenshot for your submission)

1. Register a new user → `201 Created`
2. Register the same email again → `409 Conflict`
3. Register with an invalid email → `400 Bad Request`
4. Register with a weak password (e.g. `123`) → `400 Bad Request`
5. Login with correct credentials → `200 OK` + JWT
6. Login with wrong password → `401 Unauthorized`
7. Call `/api/users/profile` with no token → `401 Unauthorized`
8. Call `/api/users/profile` with a valid token → `200 OK`
9. Hit `/api/auth/login` more than 10 times in 15 minutes → `429 Too Many Requests`
10. Confirm the connection is `https://` and the cert is self-signed (browser warning)

## Security measures implemented

- Passwords hashed with bcrypt (cost factor 12), never stored or returned in plain text
- JWT-based auth with expiry, verified via signature on every protected request
- Rate limiting on `/register` and `/login` (10 requests / 15 min / IP)
- Input validation and length limits on all fields (also blocks oversized-payload
  CPU exhaustion via bcrypt)
- Generic error responses — no stack traces, file paths, or config values ever
  reach the client; full detail goes to the server log only
- Helmet for standard HTTP security headers
- CORS restricted to a configured origin
- Request body size capped at 10kb
- Secrets loaded from `.env`, never hardcoded; startup fails fast if missing
  or too weak
- Identical error message for "no such user" and "wrong password" on login,
  to avoid leaking which emails are registered

## Known limitations (by design, for this stage)

- User storage is in-memory and resets when the server restarts — MongoDB
  integration is planned for the next part of the project.
- No password reset / email verification flow yet.
- No refresh-token rotation — a single short-lived access token only.

## A note on how this was verified

Every file here was written fresh (not just copied from a draft) and each
one was checked with `node --check` to confirm it parses correctly.
However, this was built in a sandboxed environment with no internet
access, so `npm install` could not be run here and the server was not
started or hit with real requests end-to-end. Run the setup steps above on
your own machine to do that — the code has been through a full review pass.
