const logger = require('../utils/logger');

function requestLogger(req, res, next) {
    const start = Date.now();

    res.on('finish', () => {
        logger.info('HTTP request completed', {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            durationMs: Date.now() - start
        });
    });

    next();
}

module.exports = requestLogger;