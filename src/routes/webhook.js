
import { Router, json } from "express";
import { WHATSAPP } from "./whatsapp.js";



export const WebhookRoutes = Router();


WebhookRoutes.use((req, _, next) => {
	console.log("WEBHOOK HANDLER: ", req.headers, "\n:::WEBHOOK HANDLER:::\n");
	next();
});


// Route is called on POST request to "/bot/webhook/" path
WebhookRoutes.post("/", async (req, res) => {

	console.log("\n[POST]::[WEBHOOK - ROUTE]:");

	const chunks = [];
	req.on("data", (chunk) => chunks.push(chunk));
	req.on("end", async () => {

		const body = Buffer.concat(chunks).toString();
		const parsedBody = JSON.parse(body); 
		console.log("\n\n:::::::::::::: DATA :::::::::::::::::\n", parsedBody, "  changes:", parsedBody.entry[0].changes[0], "\n[POST]::[WEBHOOK - ROUTE]:");

		try {

			// The handlers work with any middleware, as long as we pass the correct data
			const status = await WHATSAPP.post(parsedBody, body, req.headers["x-hub-signature-256"]);
			console.log("[WEBHOOK_POST STATUS]: ", status);
			res.sendStatus(status);

		} catch (error) {

			console.log("[WEBHOOK_POST ERROR]: ", error);
			res.sendStatus(error);

		}

		res.end();

	});

});


WebhookRoutes.get("/", (req, res) => {
	console.log(req.query, req.params, req.body, "[GET]::[WEBHOOK - ROUTE]:");

	try {
		const challenge = WHATSAPP.get(req.query);
		res.send(challenge);
	} catch (error) {
		console.log("[WEBHOOK_GET ERROR]: ", error);
		res.sendStatus(error);
	}
});
