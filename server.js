import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

// Course data - place this after imports, before routes
const courses = {
    'CS121': {
        id: 'CS121',
        title: 'Introduction to Programming',
        description: 'Learn programming fundamentals using JavaScript and basic web development concepts.',
        credits: 3,
        sections: [
            { time: '9:00 AM', room: 'STC 392', professor: 'Brother Jack' },
            { time: '2:00 PM', room: 'STC 394', professor: 'Sister Enkey' },
            { time: '11:00 AM', room: 'STC 390', professor: 'Brother Keers' }
        ]
    },
    'MATH110': {
        id: 'MATH110',
        title: 'College Algebra',
        description: 'Fundamental algebraic concepts including functions, graphing, and problem solving.',
        credits: 4,
        sections: [
            { time: '8:00 AM', room: 'MC 301', professor: 'Sister Anderson' },
            { time: '1:00 PM', room: 'MC 305', professor: 'Brother Miller' },
            { time: '3:00 PM', room: 'MC 307', professor: 'Brother Thompson' }
        ]
    },
    'ENG101': {
        id: 'ENG101',
        title: 'Academic Writing',
        description: 'Develop writing skills for academic and professional communication.',
        credits: 3,
        sections: [
            { time: '10:00 AM', room: 'GEB 201', professor: 'Sister Anderson' },
            { time: '12:00 PM', room: 'GEB 205', professor: 'Brother Davis' },
            { time: '4:00 PM', room: 'GEB 203', professor: 'Sister Enkey' }
        ]
    }
};

// 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';

const app = express();

// General Middleware

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.static(path.join(__dirname, 'public')));


// defining runtime mode 
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV.toLowerCase() || 'production';

    next();
});

// global data to add to all templates
app.use((req, res, next) => {
    // Add current year for copyright
    res.locals.currentYear = new Date().getFullYear();

    next();
});

// time-based greeting
app.use((req, res, next) => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
        res.locals.greeting = 'Good Morning!';
    } else if (currentHour >= 12 && currentHour <= 17) {
        res.locals.greeting = 'Good Afternoon!';
    } if (currentHour > 17) {
        res.locals.greeting = 'Good Evening!';
    };

    next();
});

// random color theme
app.use((req, res, next) => {
    const colors = ['blue-theme', 'green-theme', 'red-theme'];

    const range = Math.floor(Math.random() * colors.length);
    const randomTheme = colors[range];
    res.locals.bodyClass = randomTheme;

    next();
});

// Global middleware to share query parameters with templates
app.use((req, res, next) => {
    res.locals.queryParams = req.query || {};

    next();
})

// route specific middleware
const addDemoHeaders = ((req, res, next) => {
    res.setHeader('X-Demo-Page', 'true');
    res.setHeader('X-Middleware-Demo', 'This is a demo');

    next();
});

// Routes
app.get('/', (req, res) => {
    const title = 'Welcome Home';
    res.render('home', { title });
});

app.get ('/about', (req, res) => {
    const title = 'About Me';
    res.render('about', { title });
});

app.get ('/products', (req, res) => {
    const title = 'Our Products';
    res.render('products', { title });
});

//test route
app.get ('/error-testing', (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
})

app.get ('/catalog', (req, res) => {
    res.render('catalog', {
        title: 'Course Catalog',
        courses: courses
    });
});

// Enhanced course detail route with sorting
app.get('/catalog/:courseId', (req, res, next) => {
    const courseId = req.params.courseId;
    const course = courses[courseId];

    if (!course) {
        const err = new Error(`Course ${courseId} not found`);
        err.status = 404;
        return next(err);
    }

    // Get sort parameter (default to 'time')
    const sortBy = req.query.sort || 'time';

    // Create a copy of sections to sort
    let sortedSections = [...course.sections];

    // Sort based on the parameter
    switch (sortBy) {
        case 'professor':
            sortedSections.sort((a, b) => a.professor.localeCompare(b.professor));
            break;
        case 'room':
            sortedSections.sort((a, b) => a.room.localeCompare(b.room));
            break;
        case 'time':
        default:
            // Keep original time order as default
            break;
    }

    console.log(`Viewing course: ${courseId}, sorted by: ${sortBy}`);

    res.render('course-detail', {
        title: `${course.id} - ${course.title}`,
        course: { ...course, sections: sortedSections },
        currentSort: sortBy
    });
});

app.get('/demo', addDemoHeaders, (req, res) => {
    res.render('demo', {
        title: 'Middleware Demo Page'
    });
});

// catch-all error middleware
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// global error middleware
app.use((err, req, res, next) => {
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
        NODE_ENV // our websocket check needs this and it's convenient to pass along
    };

    try {
        res.status(status).render(`errors/${template}`, context);
    } catch (renderErr) {
        // If rendering fails, send a simple error page instead
        if (!res.headerSent) {
            res.Status(status).send(`<h1>Error ${status}</h1><p>An error occurred.</p>`);
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

