
const express = require('express');
const dotenv = require('dotenv')
dotenv.config()
const app = express();
const PORT = process.env['PORT'] ?? 8000;
const { rate_limiter } = require('./middlewares/rateLimiter')

app.use(express.json());

app.set('trust proxy', true)
app.use(rate_limiter)

app.get('/', (_, res) => res.json({
    message: 'Hello World'
}));

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));