
const express = require('express');
const dotenv = require('dotenv')
dotenv.config()
const app = express();
const PORT = process.env['PORT'] ?? 8000;
const { rateLimiter } = require('./middlewares/rateLimiter')
const { paymentController } = require('./controller/paymentController')

app.use(express.json());

const Redis = require("ioredis");

const redisClient = new Redis({
    host: process.env.REDIS_DATABASE_HOST,
    port: process.env.REDIS_DATABASE_PORT,
    password: process.env.REDIS_DATABASE_PASSWORD,
});

app.use((req, res, next) => {
    req.redisClient = redisClient;
    next();
});

app.set('trust proxy', true)

app.get('/',  rateLimiter, (_, res) => res.json({
    message: 'Request has been sent...'
}));

app.post('/clientpay', (req, res) => {
    paymentController.updateClientDetails(req, res);
    res.json({ message: 'Payment processed successfully' });
});
  

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));