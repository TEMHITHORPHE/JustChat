

import WhatsAppAPI from "whatsapp-api-js";
import { Node18 } from "whatsapp-api-js/setup/node";
import { Text, Image, Document } from "whatsapp-api-js/messages";
import * as Contacts from "whatsapp-api-js/messages/contacts";
import { OpenAIApiFp } from "openai";
import'dotenv/config';


const TOKEN = process.env.TEMP_TOKEN;
const APP_SECRET = process.env.APP_SECRET;


const Whatsapp = new WhatsAppAPI(Node18({ token: TOKEN, appSecret: APP_SECRET, webhookVerifyToken: process.env.WEBHOOK_VERIFY_TOKEN }));



Whatsapp.on.message = async ({ phoneID, from, message, name, data }) => {
	console.log(`User ${name} (${from}) sent to bot ${phoneID} ${JSON.stringify(message)} \n DATA: ${data}`);

	let promise;

	if (message.type === "text") {
		promise = Whatsapp.sendMessage(phoneID, from, new Text(`*${name}* said:\n\n${message.text.body}`), message.id);
	}

	if (message.type === "image") {
		promise = Whatsapp.sendMessage(phoneID, from, new Image(message.image.id, true, `Nice photo, ${name}`));
	}

	if (message.type === "document") {
		promise = Whatsapp.sendMessage(phoneID, from, new Document(message.document.id, true, undefined, "Our document"));
	}

	if (message.type === "contacts") {
		promise = Whatsapp.sendMessage(phoneID, from, new Contacts.Contacts(
			[
				new Contacts.Name(name, "First name", "Last name"),
				new Contacts.Phone(phone || "+2348117612515"),
				new Contacts.Birthday("2022", "04", "25"),
			],
			[
				new Contacts.Name("John", "First name", "Last name"),
				new Contacts.Organization("Company", "Department", "Title"),
				new Contacts.Url("https://www.google.com", "WORK"),
			]
		));
	}

	console.log(await promise ?? "There are more types of messages, such as locations, templates, interactives, reactions and all the other media types.");

	Whatsapp.markAsRead(phoneID, message.id);
	
};



Whatsapp.on.sent = ({ phoneID, to, message, raw }) => {
	console.log(`Bot ${phoneID} sent to user ${to} ${message}\n\n${JSON.stringify(raw)}`);
};


export const WHATSAPP = Whatsapp;