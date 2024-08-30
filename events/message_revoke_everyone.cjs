module.exports = async (client, msg) => {
	const db = client.db;

	const timestamp = new Date(msg.timestamp * 1000).toISOString();
	
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
}