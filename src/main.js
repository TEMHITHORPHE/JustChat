
import express from 'express';
import { WebhookRoutes } from './routes/webhook.js';

// Loads .env content
import { config } from 'dotenv';
config();

const app = express();

app.get('/', function (_, res) {
	res.send('Just Chat AI Assistant!! ');
})

app.use("/bot/webhook", WebhookRoutes);

app.listen(process.env.EXPRESS_SERVER_LISTENING_PORT || 3000);
console.log(`Listening on: http://localhost:${process.env.EXPRESS_SERVER_LISTENING_PORT}`);