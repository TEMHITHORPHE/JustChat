
import express from 'express';
import { WebhookRoutes } from './routes/webhook.js';

// Loads .env content
import 'dotenv/config';

const app = express();

app.get('/', function (_, res) {
	res.send('JustChat AI Assistant!! ');
})

app.use("/bot/webhook", WebhookRoutes);

app.listen(process.env.EXPRESS_SERVER_LISTENING_PORT || 3000);

console.log(`Listening on: http://localhost:${process.env.EXPRESS_SERVER_LISTENING_PORT}`);