// Fails fast on startup if required environment variables are missing or
// obviously unsafe. Better to crash loudly at boot than to run with a
// missing JWT secret or silently fall back to an insecure default.

const REQUIRED_VARS = ["PORT", "JWT_SECRET", "JWT_EXPIRES_IN", "NODE_ENV"];

function validateEnv() {
    const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        console.error(
            `Missing required environment variable(s): ${missing.join(", ")}. ` +
            "Copy .env.example to .env and fill in real values."
        );
        process.exit(1);
    }

    if (process.env.JWT_SECRET.length < 32) {
        console.error(
            "JWT_SECRET is too short. Generate a strong secret with: npm run gen-secret"
        );
        process.exit(1);
    }

    if (
        process.env.NODE_ENV === "production" &&
        process.env.JWT_SECRET.includes("change_this")
    ) {
        console.error(
            "Refusing to start in production with a placeholder JWT_SECRET."
        );
        process.exit(1);
    }
}

module.exports = validateEnv;
