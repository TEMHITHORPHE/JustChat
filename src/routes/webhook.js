
import { Router } from "express";
import { WHATSAPP } from "./whatsapp.js";



export const WebhookRoutes = Router();


WebhookRoutes.use((req, _, next) => {
	console.log("WEBHOOK HANDLER: ", req.headers, req.params, req.query, "\n:::WEBHOOK HANDLER:::");
	next();
});


WebhookRoutes.post("/", async (req, res) => {

	// Assuming post is called on a POST request to your server
	try {

		// The handlers work with any middleware, as long as you pass the correct data
		const status = await WHATSAPP.post(JSON.parse(req.data), req.data, req.headers["x-hub-signature-256"]);
		console.log("[WEBHOOK_POST STATUS]: ", status);
		res.sendStatus(status);

	} catch (error) {

		console.log("[WEBHOOK_POST ERROR]: ", error);
		res.sendStatus(error);

	}
	return;
});


WebhookRoutes.get("/verify", (req, res) => {
	try {
		// console.log("PARSED::: ", (req.query));
		const challenge = WHATSAPP.get(req.query);
		res.send(challenge);
	} catch (error) {
		console.log("[WEBHOOK_GET ERROR]: ", error);
		res.sendStatus(error);
	}
});