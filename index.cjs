const { Client, LocalAuth } = require("whatsapp-web.js");
const sqlite3 = require("sqlite3").verbose();
const path = require("node:path");
const fs = require("node:fs");
require("dotenv").config();
const db = require('./data/db.cjs')



const client = new Client({
	authStrategy: new LocalAuth({
		dataPath: "whatsappAuth",
	}),
	puppeteer: {
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox'
		]
	}
});

const functions = {}

const functionsDir = fs.readdirSync(
	path.join(__dirname, 'data/functions')
).filter(file => file.endsWith('.cjs'))

for (const functionFile of functionsDir) {
	const functionName = functionFile.split('.')[0]
	const functionData = require(
		path.join(__dirname, 'data/functions', functionFile)
	)

	functions[functionName] = functionData
}

client.functions = functions
client.db = db

const eventsDir = fs.readdirSync(
	path.join(__dirname, 'events')
).filter(file => file.endsWith('.cjs'))

for (const eventFile of eventsDir) {
	const eventName = eventFile.split('.')[0]
	const eventData = require(
		path.join(__dirname, 'events', eventFile)
	)

	client.on(eventName, eventData.bind(null, client))

	console.log(`Successfully loaded the event "${eventName}"`)
}

client.initialize();

process.on("SIGINT", () => {
	db.close((err) => {
		if (err) {
			return console.error(err.message);
		}
		console.log("Close the database connection.");
		process.exit(0);
	});
});
