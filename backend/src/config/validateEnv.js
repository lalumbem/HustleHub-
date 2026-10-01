const REQUIRED_VARS = ['PORT', 'JWT_SECRET', 'JWT_EXPIRES_IN', 'NODE_ENV', 'MONGO_URI'];

function validateEnv() {
    const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
    if (missing.length) {
        console.error(`Missing required environment variable(s): ${missing.join(', ')}.`);
        process.exit(1);
    }

    if (process.env.JWT_SECRET.length < 32) {
        console.error('JWT_SECRET is too short. Run: npm run gen-secret');
        process.exit(1);
    }
}

module.exports = validateEnv;
