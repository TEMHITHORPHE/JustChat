

import WhatsAppAPI from "whatsapp-api-js";
import { Node18 } from "whatsapp-api-js/setup/node";
import { Text, Image, Document } from "whatsapp-api-js/messages";
// import * as Contacts from "whatsapp-api-js/messages/contacts";
import { Configuration, OpenAIApi } from "openai";
import 'dotenv/config';


const TOKEN = process.env.FB_TEMP_TOKEN;
const APP_SECRET = process.env.FB_APP_SECRET;

const Whatsapp = new WhatsAppAPI(Node18({ token: TOKEN, appSecret: APP_SECRET, webhookVerifyToken: process.env.FB_WEBHOOK_VERIFY_TOKEN }));
// console.log("Whatsapp: ", Whatsapp);

const configuration = new Configuration({ organization: process.env.OPENAI_ORG_ID, apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);



// Simple API test
// const completion = await openai.createChatCompletion({
// 	user: "sally",
// 	model: "gpt-3.5-turbo",
// 	messages: [
// 		{ "role": "system", "content": "I am a selflessly helpful AI assistant named Jess, I keep responses short if possible. I format my answer for reading on whatsapp." },
// 		{ role: "user", content: 'What is todays date?' }
// 	],
// });
// console.log(completion.data.choices[0].message);




Whatsapp.on.message = async ({ phoneID, from, message, name, data }) => {
	console.log(`User ${name} (${from}) sent to bot ${phoneID} ${JSON.stringify(message)} \n DATA: ${data}`);

	let promise;
	let openAIReply;
	
	if (message.type === "text") {
		const userQuestion = message.text.body;
		
		try {

			const completion = await openai.createChatCompletion({
				user: "sally",
				model: "gpt-3.5-turbo",
				messages: [
					{ "role": "system", "content": 'I am a selfless, helpful assistant named Jess, cool, calm and kind, I keep responses short if possible. I format my answer for reading on whatsapp.' },
					{
						role: "user",
						content: ["", " ", ".", "?"].includes(userQuestion) ? "Your name?" : userQuestion
					}
				],
			});

			// Retrieve text response
			openAIReply = completion.data.choices[0].message.content;
			console.log("[ChatGPT]: ", openAIReply);

		} catch (error) {

			openAIReply = `*[Error]:*\n*"${error}*\n\n *Accept my sincerest apologies*`;
		}

		promise = Whatsapp.sendMessage(phoneID, from, new Text(`*${'Jess'}*:\n${openAIReply || "*Sorry, You said?*"}`), message.id);
	}

	console.log(await promise ?? "There are more types of messages, such as locations, templates, interactives, reactions and all the other media types.");

	Whatsapp.markAsRead(phoneID, message.id);
};



Whatsapp.on.sent = ({ phoneID, to, message, raw }) => {
	console.log(`Bot ${phoneID} sent to user ${to} ${message} || ${JSON.stringify(raw)}`);
};












// if (message.type === "image") {
// 	promise = Whatsapp.sendMessage(phoneID, from, new Image(message.image.id, true, `Nice photo, ${name}`));
// }

// if (message.type === "document") {
// 	promise = Whatsapp.sendMessage(phoneID, from, new Document(message.document.id, true, undefined, "Our document"));
// }

// if (message.type === "contacts") {
// 	promise = Whatsapp.sendMessage(phoneID, from, new Contacts.Contacts(
// 		[
// 			new Contacts.Name(name, "First name", "Last name"),
// 			new Contacts.Phone(phone || "+2348117612515"),
// 			new Contacts.Birthday("2022", "04", "25"),
// 		],
// 		[
// 			new Contacts.Name("John", "First name", "Last name"),
// 			new Contacts.Organization("Company", "Department", "Title"),
// 			new Contacts.Url("https://www.google.com", "WORK"),
// 		]
// 	));
// }
export const WHATSAPP = Whatsapp;