
import { Router } from "express";
import { WHATSAPP_POST_HANDLER } from "./whatsapp";



const WebhookRoutes = Router();


WebhookRoutes.use((req, res, next) => {
	console.log("WEBHOOK HANDLER: ", req, "\n:::WEBHOOK HANDLER:::");
	next();
});


WebhookRoutes.post("/", async (req, res) => {
	
	// Assuming post is called on a POST request to your server
	try {

		// The handlers work with any middleware, as long as you pass the correct data
		const status = await WHATSAPP_POST_HANDLER(JSON.parse(req.data), req.data, req.headers["x-hub-signature-256"]);
		console.log("[WEBHOOK_POST STATUS]: ", status);
		res.sendStatus(status);

	} catch (error) {

		console.log("[WEBHOOK_POST ERROR]: ", error);
		res.sendStatus(error);

	}
	return;
});


export default WebhookRoutes;