require("dotenv").config();

const validateEnv = require("./config/validateEnv");
validateEnv();

const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const { errorHandler, notFoundHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(helmet());

app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "https://localhost:3001"
    })
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the HustleHub+ API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Catch-all for unmatched routes, then the central error handler.
// Order matters: notFoundHandler must come after all real routes,
// and errorHandler must be registered last of all.
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const CERT_KEY_PATH = path.join(__dirname, "..", "cert", "server.key");
const CERT_CRT_PATH = path.join(__dirname, "..", "cert", "server.crt");

if (!fs.existsSync(CERT_KEY_PATH) || !fs.existsSync(CERT_CRT_PATH)) {
    console.error(
        "Missing SSL certificate. Generate one first, e.g.:\n" +
        "openssl req -x509 -newkey rsa:2048 -nodes -keyout cert/server.key " +
        "-out cert/server.crt -days 365"
    );
    process.exit(1);
}

const sslOptions = {
    key: fs.readFileSync(CERT_KEY_PATH),
    cert: fs.readFileSync(CERT_CRT_PATH)
};

https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`HustleHub+ HTTPS API running on https://localhost:${PORT}`);
});
