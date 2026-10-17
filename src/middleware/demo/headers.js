// route specific middleware
export const addDemoHeaders = ((req, res, next) => {
    res.setHeader('X-Demo-Page', 'true');
    res.setHeader('X-Middleware-Demo', 'This is a demo');

    next();
});