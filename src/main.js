
import express from 'express';
import { config } from 'dotenv';
import { WebhookRoutes } from './routes/webhook'; 

// Loads .env content
config();

ngrok
const app = express();

app.get('/', function (req, res) {
	res.send('Hello World');
})

app.use("/bot/webhook", WebhookRoutes);

app.listen(process.env.EXPRESS_SERVER_LISTENING_PORT || 3000);