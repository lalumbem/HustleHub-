
require('dotenv').config();

const validateEnv = require('./config/validateEnv');
validateEnv();

const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const gigRoutes = require('./routes/gigRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');
const sanitizeInput = require('./middleware/sanitizeMiddleware');
const { apiLimiter } = require('./middleware/rateLimiter');

// Cloud logging
const logger = require('./utils/logger');
const requestLogger = require('./middleware/requestLogger');

const app = express();

app.disable('x-powered-by');

// Record HTTP requests and response status codes
app.use(requestLogger);

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            objectSrc: ["'none'"],
            frameAncestors: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"]
        }
    }
}));

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3006'
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitize({ replaceWith: '_' }));
app.use(sanitizeInput);

app.get('/', (req, res) => res.json({ message: 'Welcome to the HustleHub+ API' }));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/bookings', bookingRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const CERT_KEY_PATH = path.join(__dirname, '..', 'cert', 'server.key');
const CERT_CRT_PATH = path.join(__dirname, '..', 'cert', 'server.crt');

if (!fs.existsSync(CERT_KEY_PATH) || !fs.existsSync(CERT_CRT_PATH)) {
    logger.error('Missing SSL certificate. Generate one first.');
    process.exit(1);
}

const sslOptions = {
    key: fs.readFileSync(CERT_KEY_PATH),
    cert: fs.readFileSync(CERT_CRT_PATH)
};

async function startServer() {
    try {
        await connectDB();

        https.createServer(sslOptions, app).listen(PORT, () => {
            logger.info('HustleHub+ HTTPS API started', {
                port: PORT,
                environment: process.env.NODE_ENV || 'development'
            });
        });
    } catch (error) {
        logger.error('MongoDB connection failed', {
            error: error.message
        });
        process.exit(1);
    }
}

startServer();
