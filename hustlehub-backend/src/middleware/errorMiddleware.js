// Central error handler. Logs full detail server-side only; the client
// only ever sees a generic message, so stack traces, file paths, and
// internal config never leak in a response body.
const errorHandler = (err, req, res, next) => {
    console.error(err);

    // express.json() throws a SyntaxError with a `status`/`statusCode` of
    // 400 when the request body isn't valid JSON. Without this check that
    // error falls through to a 500 and (in some setups) Express's default
    // HTML error page, which is both misleading and a minor info leak.
    if (err.type === "entity.parse.failed" || err instanceof SyntaxError) {
        return res.status(400).json({
            message: "Request body must be valid JSON."
        });
    }

    const status = err.status || err.statusCode || 500;

    res.status(status).json({
        message: status === 500
            ? "An unexpected error occurred."
            : err.message || "An unexpected error occurred."
    });
};

const notFoundHandler = (req, res) => {
    res.status(404).json({
        message: "Resource not found."
    });
};

module.exports = { errorHandler, notFoundHandler };
