# HustleHub+ Backend

The backend is an Express API backed by MongoDB/Mongoose.

## Run

```powershell
npm install
Copy-Item .env.example .env
npm run gen-secret
npm run dev
```

Set `MONGO_URI=mongodb://127.0.0.1:27017/hustlehub` and the generated JWT secret in `.env`.

For repeated Newman runs, start the API in test mode in a separate terminal:

```powershell
npm run dev:test
```

## Test

```powershell
npm run test:api
```

Newman runs the Postman collection at `postman/HustleHub.postman_collection.json` against `https://localhost:3000` with the `--insecure` option for the local certificate.

## Endpoints

- `POST /api/auth/register` — public registration
- `POST /api/auth/login` — public login
- `GET /api/users/profile` — authenticated profile
- `GET /api/gigs` — public marketplace
- `GET /api/gigs/:id` — public gig details
- `GET /api/gigs/mine` — freelancer's own gigs
- `POST /api/gigs` — freelancer creates gig
- `PUT /api/gigs/:id` — owner updates gig
- `DELETE /api/gigs/:id` — owner deletes gig
- `POST /api/bookings` — client creates booking and transaction
- `GET /api/bookings/mine` — user's bookings; freelancer also receives transactions/income

All protected endpoints require a valid JWT and role checks. Gig update/delete also verify ownership server-side.
