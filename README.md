# HustleHub+ — Secure MERN Freelance Marketplace (Part 2)

HustleHub+ is a full-stack MERN freelance marketplace. Freelancers can create and manage their own gigs, clients can browse and book gigs, and every successful simulated booking creates a persistent transaction linked to the client, freelancer and gig. Freelancer income is calculated from their transaction records.

## Technology Stack

- MongoDB + Mongoose
- Node.js + Express
- React + Vite
- JWT authentication
- bcrypt password hashing
- Helmet + Content Security Policy
- CORS
- express-rate-limit
- express-validator
- xss sanitisation
- express-mongo-sanitize
- Postman + Newman
- Vitest + React Testing Library
- Local HTTPS development certificate

## Assessment Requirement Coverage

1. **Gig management:**  
   Freelancers can create, view, update and delete their own gigs. Server-side ownership checks prevent freelancers from modifying or deleting gigs belonging to another freelancer.

2. **React frontend:**  
   The React frontend provides registration, login, marketplace browsing, gig management, bookings and dashboards.

3. **Register/login/browse/book:**  
   Users can register and log in, clients can browse gigs and create bookings, and invalid input produces safe validation errors. Sensitive server information is not displayed in the frontend.

4. **Bookings/transactions:**  
   Clients can book gigs using simulated confirmation. Each successful booking creates a persistent MongoDB transaction record associated with the booking, client, freelancer and gig.

5. **Freelancer income:**  
   Freelancer bookings and transactions are associated with the correct freelancer. Freelancer dashboards display booking information and calculated income.

6. **Security:**  
   JWT authentication, role-based access control, server-side ownership checks, validation, XSS sanitisation and MongoDB operator sanitisation are implemented.

7. **Security hardening:**  
   Authentication and booking endpoints have dedicated rate limits. Helmet security headers and an explicit Content Security Policy are configured.

8. **Testing:**  
   The project includes a Postman collection, Newman API tests, and frontend Vitest/React Testing Library tests.

9. **Documentation:**  
   This README documents the project structure, setup process, features, API endpoints, security controls and testing procedures.

## Project Structure

```text
APDS7311 PART 2/

├── backend/
│   ├── cert/
│   ├── postman/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   └── package.json
│
└── README.md