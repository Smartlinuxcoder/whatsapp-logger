const sqlite3 = require("sqlite3").verbose();
const mimetypes = require("mime-types");
const path = require("node:path");
const fs = require("node:fs");

module.exports = async (client, msg) => {
	const db = new sqlite3.Database('./messages.db');

	if (msg.body === '!test') {
		db.all("SELECT * FROM messages", [], (err, rows) => {
			if (err) {
				throw err;
			}
			// Print all fromMe values in one line
			console.log(rows);
		});
	}

	const fromNumber = msg.from;
	const toNumber = msg.to;
	const messageText = msg.body;
	const timestamp = new Date(msg.timestamp * 1000).toISOString();
	const messageId = msg.id.id
	const messageAuthor = msg.author
	const notifyName = msg._data.notifyName
	const quotedId = msg._data?.quotedMsg?.id?.id
	const fromMe = msg.id.fromMe

	let filename;
	let filesize;
	let dbPath;

	if (msg.hasMedia) {
		const media = await msg.downloadMedia();

		filename = media.filename || 'unknown';
		filesize = media.filesize;
		const mimetype = media.mimetype;
		const extension = mimetypes.extension(mimetype) || "txt";
		const base64Data = media.data;

		const buffer = Buffer.from(base64Data, "base64").toString("binary");

        if (!fs.existsSync(
            path.join(__dirname, '../static/attachments')
        )) fs.mkdirSync(
            path.join(__dirname, '../static/attachments'),
            {
                recursive: true
            }
        )

		const filePath = path.join(__dirname, `../static/attachments/${msg.id.id}.${extension}`)
		dbPath = `/attachments/${msg.id.id}.${extension}`

		fs.writeFileSync(
			filePath,
			buffer,
			"binary",
		);
	}

	db.run(
		"INSERT INTO messages (fromNumber, toNumber, messageText, timestamp, media, mediaName, mediaSize, deleted, messageId, author, name, quotedId, fromMe) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		[
			fromNumber,
			toNumber,
			messageText,
			timestamp,
			dbPath,
			filename,
			filesize,
			0,
			messageId,
			messageAuthor,
			notifyName,
			quotedId,
			fromMe
		],
		function (err) {
			if (err) {
				return console.error(err.message);
			}
			console.log(`A row has been inserted with rowid ${this.lastID} (message received)`);
		},
	);
}