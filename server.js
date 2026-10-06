import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';

const app = express();

//middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV.toLowerCase() || 'production';

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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

