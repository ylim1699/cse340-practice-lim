import express from 'express';

const app = express();
const PORT = 3000;

const name = process.env.NAME;

app.get('/', (req, res) => {
    res.send(`Hello, ${name}`);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

