module.exports = async (client, msg) => {
    const db = client.db;

	const messageText = msg.body;
	const timestamp = new Date(msg.timestamp * 1000).toISOString();
    const messageId = msg.id.id

	db.run(
        "INSERT INTO message_edits (messageText, timestamp, messageId) VALUES (?, ?, ?)",
        [
            messageText,
            timestamp,
            messageId,
        ],
        function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`A row has been inserted with rowid ${this.lastID} (message edited)`);
        },
    );
}