// Central error handler. Detailed errors stay server-side; clients receive
// safe messages without stack traces, file paths, or configuration values.
const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (err.type === 'entity.parse.failed' || err instanceof SyntaxError) {
        return res.status(400).json({ message: 'Request body must be valid JSON.' });
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: 'Database validation failed.' });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid resource identifier.' });
    }

    if (err.code === 11000) {
        return res.status(409).json({ message: 'A record with those details already exists.' });
    }

    const status = err.status || err.statusCode || 500;
    return res.status(status).json({
        message: status === 500 ? 'An unexpected error occurred.' : (err.message || 'An unexpected error occurred.')
    });
};

const notFoundHandler = (req, res) => {
    res.status(404).json({ message: 'Resource not found.' });
};

module.exports = { errorHandler, notFoundHandler };
