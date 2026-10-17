// time-based greeting
export const getCurrentGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
        return 'Good Morning!';
    } else if (currentHour >= 12 && currentHour <= 17) {
        return 'Good Afternoon!';
    } else if (currentHour > 17) {
        return 'Good Evening!';
    };
};


export const addLocalVariables = (req, res, next) => {
    // runtime mode
    res.locals.NODE_ENV = process.env.NODE_ENV.toLowerCase() || 'production';

    // current year
    res.locals.currentYear = new Date().getFullYear();

    // theme colors
    const colors = ['blue-theme', 'green-theme', 'red-theme'];

    const range = Math.floor(Math.random() * colors.length);
    const randomTheme = colors[range];
    res.locals.bodyClass = randomTheme;

    // Set greeting use the helper function above
    res.locals.greeting = getCurrentGreeting();

    // query parameter
    res.locals.queryParams = req.query || {};

    next();
};
