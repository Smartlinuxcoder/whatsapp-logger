const { Client, LocalAuth } = require("whatsapp-web.js");
const sqlite3 = require("sqlite3").verbose();
const qrcode = require("qrcode-terminal");
const mimetypes = require("mime-types");
const path = require("node:path");
const fs = require("node:fs");
const axios = require("axios");
require("dotenv").config();

// Initialize the SQLite3 database
const db = new sqlite3.Database("messages.db", (err) => {
	if (err) {
		return console.error(err.message);
	}
	console.log("Connected to the messages SQlite database.");
});

// Create a table for storing messages if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fromNumber TEXT,
        toNumber TEXT,
        messageText TEXT,
        timestamp TEXT,
        media TEXT,
        mediaName TEXT,
        mediaSize NUM,
        deleted INT,
        messageId TEXT,
        name TEXT,
        quotedId TEXT,
        author TEXT,
		fromMe BOOL,
		hasMedia BOOL
    )
`);

db.run(`
    CREATE TABLE IF NOT EXISTS message_edits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        messageText TEXT,
        timestamp TEXT,
        media TEXT,
        mediaName TEXT,
        mediaSize NUM,
        messageId TEXT
    )
`);

// db.all("SELECT * FROM messages", [], (err, rows) => {
//     if (err) {
//         throw err;
//     }
//     // Print all fromMe values in one line
//     console.log(rows);
// });

let token = null;

const client = new Client({
	authStrategy: new LocalAuth({
		dataPath: "whatsappAuth",
	}),
	/* puppeteer: {
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
    ]
  } */
});

// Generate QR code for authentication
client.on("qr", (qr) => {
	qrcode.generate(qr, { small: true });
});

// Log when the client is ready
client.on("ready", () => {
	console.log("Client is ready!");
});

// Respond to messages and log them to the database
client.on("message_create", async (msg) => {
	console.log(msg.id.fromMe);

	const fromNumber = msg.from;
	const toNumber = msg.to;
	const messageText = msg.body;
	const timestamp = new Date(msg.timestamp * 1000).toISOString();
	const hasMedia = msg.hasMedia
	const messageId = msg.id.id
	const messageAuthor = msg.author
	const notifyName = msg._data.notifyName
	const quotedId = msg._data?.quotedMsg?.id?.id
	const fromMe = msg.id.fromMe

	let filename;
	let filesize;
	let filePath;

	if (msg.hasMedia) {
		const media = await msg.downloadMedia();

		filename = media.filename || 'unknown';
		filesize = media.filesize;
		const mimetype = media.mimetype;
		const extension = mimetypes.extension(mimetype) || "txt";
		const base64Data = media.data;

		const buffer = Buffer.from(base64Data, "base64").toString("binary");

        if (!fs.existsSync(
            path.join(__dirname, 'attachments')
        )) fs.mkdirSync(
            path.join(__dirname, 'attachments'),
            {
                recursive: true
            }
        )

		filePath = path.join(__dirname, `attachments/${msg.id.id}.${extension}`)

		fs.writeFileSync(
			filePath,
			buffer,
			"binary",
		);
	}

	// Insert the message into the SQLite database
	db.run(
		"INSERT INTO messages (fromNumber, toNumber, messageText, timestamp, media, mediaName, mediaSize, deleted, messageId, author, name, quotedId, fromMe, hasMedia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		[
			fromNumber,
			toNumber,
			messageText,
			timestamp,
			filePath,
			filename,
			filesize,
			0,
			messageId,
			messageAuthor,
			notifyName,
			quotedId,
			fromMe,
			hasMedia
		],
		function (err) {
			if (err) {
				return console.error(err.message);
			}
			console.log(`A row has been inserted with rowid ${this.lastID} (message received)`);
		},
	);
});

client.on("message_revoke_everyone", (msg) => {
	const timestamp = new Date(msg.timestamp * 1000).toISOString();
	console.log(msg);
	db.run(
		"UPDATE messages SET deleted = 2 WHERE timestamp = ?",
		[timestamp],
		function (err) {
			if (err) {
				return console.error(err.message);
			}
			console.log(`A row has been modified with rowid ${this.lastID} (message deleted - everyone)`);
		},
	);
});

client.on("message_revoke_me", (msg) => {
	console.log(msg);
    const timestamp = new Date(msg.timestamp * 1000).toISOString();
	db.run(
		"UPDATE messages SET deleted = 1 WHERE timestamp = ?",
		[timestamp],
		function (err) {
			if (err) {
				return console.error(err.message);
			}
			console.log(`A row has been modified with rowid ${this.lastID} (message deleted - everyone)`);
		},
	);
})

client.on("message_edit", async (msg) => {
	const messageText = msg.body;
	const timestamp = new Date(msg.timestamp * 1000).toISOString();

    if (msg.hasMedia) {
		const media = await msg.downloadMedia();

		const filename = media.filename;
		const mimetype = media.mimetype;
		const base64Data = media.data;
		const filesize = media.filesize;
		const extension = mimetypes.extension(mimetype) || "txt";

		const buffer = Buffer.from(base64Data, "base64").toString("binary");

		fs.writeFileSync(
			path.join(__dirname, `static/attachments/${msg.id.id}.${extension}`),
			buffer,
			"binary",
		);

		return db.run(
			"INSERT INTO message_edits (messageText, timestamp, media, mediaName, mediaSize, messageId) VALUES (?, ?, ?, ?, ?, ?)",
			[
				messageText,
				timestamp,
				`/static/attachments/${msg.id.id}.${extension}`,
				filename,
				filesize,
				msg.id.id,
			],
			function (err) {
				if (err) {
					return console.error(err.message);
				}
				console.log(`A row has been inserted with rowid ${this.lastID} (message edited)`);
			},
		);
	}

	db.run(
        "INSERT INTO message_edits (messageText, timestamp, messageId) VALUES (?, ?, ?)",
        [
            messageText,
            timestamp,
            msg.id.id,
        ],
        function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`A row has been inserted with rowid ${this.lastID} (message edited)`);
        },
    );
});

client.initialize();

// Close the database connection when the Node.js process ends
process.on("SIGINT", () => {
	db.close((err) => {
		if (err) {
			return console.error(err.message);
		}
		console.log("Close the database connection.");
		process.exit(0);
	});
});
