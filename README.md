\# HustleHub+ – Secure MERN Freelance Marketplace



## \## **1. Project Overview**



HustleHub+ is a secure MERN-based freelance marketplace that connects clients with freelancers. Freelancers can create and manage gigs, while clients can browse available services and make bookings.



The application includes user authentication, role-based access control, booking and transaction management, freelancer income summaries, estimated tax calculations, automated testing, Docker containerisation, static security analysis and cloud-based logging.

### 

### \## **2. Technology Stack**



\- \*\*Frontend:\*\* React, Vite, JavaScript and CSS

\- \*\*Backend:\*\* Node.js and Express

\- \*\*Database:\*\* MongoDB and Mongoose

\- \*\*Authentication:\*\* JWT and bcrypt

\- \*\*Security:\*\* Helmet, Content Security Policy, CORS, express-rate-limit, express-validator and sanitisation middleware

\- \*\*Testing:\*\* Node.js test runner, Vitest, React Testing Library, Postman and Newman

\- \*\*CI/CD:\*\* GitHub Actions

\- \*\*Static analysis:\*\* GitHub CodeQL

\- \*\*Containerisation:\*\* Docker and Docker Compose

\- \*\*Cloud logging:\*\* Axiom



### \## **3. Main Application Features**



##### \### **3.1 User Authentication and Access Control**



Users can register and log in securely. Passwords are hashed using bcrypt, and JWT authentication protects restricted application routes. Role-based access control separates client and freelancer permissions.



##### \### **3.2 Gig Management**



Freelancers can create, view, update and delete their own gigs. Server-side ownership checks prevent users from modifying another freelancer's gigs.



##### \### **3.3 Booking and Transactions**



Clients can browse available gigs and make bookings. Successful simulated bookings create persistent transaction records associated with the client, freelancer and gig.



##### \### **3.4 Income and Estimated Tax Dashboard**



The freelancer dashboard displays gross income, estimated tax, income after estimated tax and booking information.



The application uses an illustrative flat tax rate of 20%:



\- Estimated tax = Gross income × 20%

\- Income after estimated tax = Gross income − Estimated tax



This calculation is an educational estimate and is not an official SARS tax calculation or tax advice.



### **## 4. DevSecOps Implementation**



##### \##**# 4.1 CI/CD Pipeline**



A GitHub Actions workflow is configured in `.github/workflows/ci.yml`.



The pipeline performs the following checks:



1\. Checks out the repository.

2\. Sets up Node.js.

3\. Installs backend dependencies.

4\. Runs backend tests.

5\. Installs frontend dependencies.

6\. Runs frontend tests.

7\. Builds the frontend production application.

8\. Performs CodeQL static security analysis.



The workflow runs on pushes and pull requests targeting the `main` branch and can also be started manually.



##### \### **4.2 Static Code Analysis**



GitHub CodeQL is integrated into the workflow to analyse JavaScript and TypeScript code for potential security vulnerabilities.



CodeQL results can be reviewed under the repository's Security section on GitHub.



##### \### **4.3 Docker Containerisation**



The application uses separate Dockerfiles for the backend and frontend.



Docker Compose manages both services:



\- Backend API: port 3000

\- Frontend application: port 8080



To build and start the containers:



```bash

docker compose up -d --build

```



To check container status:



```bash

docker compose ps

```



To view backend logs:



```bash

docker compose logs backend

```



To stop the containers:



```bash

docker compose down

```



Application URLs:



\- Frontend: http://localhost:8080

\- Backend health endpoint: https://localhost:3000/health



The local HTTPS development certificate may require accepting a browser security warning. For command-line health checks, use:



```bash

curl -k https://localhost:3000/health

```



#### **## 5. Cloud-Based Logging and Monitoring**



HustleHub+ integrates with Axiom for centralised cloud-based application logging.



The backend logger records structured events containing:



\- Timestamp

\- Log level

\- Service name

\- Event message

\- Additional request metadata



The request logging middleware records HTTP methods, request paths, response status codes and request durations.



Events are sent to the Axiom dataset named `hustlehub-logs`.



The Axiom integration uses environment variables:



\- `AXIOM\\\_TOKEN`

\- `AXIOM\\\_DATASET`

\- `AXIOM\\\_EDGE`



The API token is stored locally in the backend environment configuration and must never be committed to GitHub or included in this README.



#### \#**# 6. Security Review**



| Potential threat | Security protection implemented |

|---|---|

| Unauthorised account access | JWT authentication |

| Password exposure | bcrypt password hashing |

| Unauthorised role access | Role-based access control |

| Access to another user's gigs | Server-side ownership checks |

| Cross-site scripting (XSS) | Input sanitisation |

| MongoDB injection | MongoDB operator sanitisation |

| Excessive API requests | Rate limiting |

| Insecure HTTP headers | Helmet and Content Security Policy |

| Untrusted frontend origins | CORS configuration |

| Invalid or malicious input | Server-side validation |

| Exposure of configuration secrets | Environment variables and Git ignore rules |

| Limited visibility of application activity | Structured logging and Axiom cloud monitoring |



Security configuration and access controls are enforced primarily on the backend rather than relying only on frontend restrictions.



#### **## 7. Testing**



\### Backend tests



Run from the backend directory:



```bash

npm test

```



The tax calculator tests cover:



\- Correct estimated tax calculations.

\- Zero income.

\- Negative income validation.

\- Invalid income validation.



\### Frontend tests



Run from the frontend directory:



```bash

npm test

```



Frontend tests use Vitest and React Testing Library.



\### Production build



Run from the frontend directory:



```bash

npm run build

```



\### API testing



The project includes a Postman collection and Newman configuration for API testing.



#### **## 8. Environment Configuration**



Create the required local environment files using the provided `.env.example` files.



Configure the MongoDB connection, JWT secret, HTTPS certificate settings and Axiom credentials locally.



Do not commit `.env` files, private keys, API tokens or other sensitive credentials.



The Docker configuration also uses a local Docker-specific environment file where required.



#### **## 9. Project Structure**



```text

HustleHub-/

│

├── .github/

│   └── workflows/

│       └── ci.yml

│

├── backend/

│   ├── src/

│   │   ├── config/

│   │   ├── controllers/

│   │   ├── middleware/

│   │   │   └── requestLogger.js

│   │   ├── models/

│   │   ├── routes/

│   │   └── utils/

│   │       └── logger.js

│   ├── tests/

│   ├── postman/

│   ├── Dockerfile

│   ├── .dockerignore

│   ├── .env.example

│   └── package.json

│

├── frontend/

│   ├── src/

│   │   ├── components/

│   │   ├── context/

│   │   └── pages/

│   ├── Dockerfile

│   ├── .dockerignore

│   ├── .env.example

│   └── package.json

│

├── docker-compose.yml

└── README.md

```



#### **## 10. Conclusion**



HustleHub+ demonstrates the development of a secure full-stack freelance marketplace supported by DevSecOps practices. The project combines authentication, access control, income and estimated tax calculations, automated testing, CI/CD, static security analysis, Docker containerisation and Axiom cloud logging.



These implementations improve application security, deployment consistency, testing and monitoring while supporting the finalisation of the marketplace.

