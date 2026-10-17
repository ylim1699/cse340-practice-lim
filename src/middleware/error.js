const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// catch-all error middleware
export const catchAllError = (req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
};

// global error middleware
export const globalErrorHandler = (err, req, res, next) => {
    // prevents infinite loops, if a response has alraedy been sent, do nothing
    if (res.headersSent || res.finished) {
        return next(err);
    }

    // determine status and template
    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';

    const context = {
        // for production, hides sensitive error details!
        title: status === 404? 'Page Not Found' : 'Server Error',
        error: NODE_ENV === 'production' ? 'An error occurred' : err.message,
        stack: NODE_ENV === 'production' ? null : err.stack,
        NODE_ENV, // our websocket check needs this and it's convenient to pass along
    };

    try {
        res.status(status).render(`errors/${template}`, context);
    } catch (renderErr) {
        // If rendering fails, send a simple error page instead
        if (!res.headerSent) {
            res.Status(status).send(`<h1>Error ${status}</h1><p>An error occurred.</p>`);
        }
    }
};