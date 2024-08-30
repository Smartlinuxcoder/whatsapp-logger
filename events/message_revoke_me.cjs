const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database('./messages.db');

module.exports = async (client, msg) => {
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
}