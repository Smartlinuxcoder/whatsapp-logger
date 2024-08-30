const sqlite3 = require("sqlite3").verbose();

module.exports = async (client) => {
	const db = new sqlite3.Database('./messages.db');

	const myNumber = client.info.wid._serialized
	
	console.log("Client is ready!");

	db.get("SELECT * FROM info", [], (err, row) => {
        if (err) {
            throw err;
        }

        if (!row) {
            db.run("INSERT INTO info (myNumber) VALUES (?)", [myNumber], (err) => {
                if (err) {
                    throw err;
                }
                console.log("New myNumber created:", myNumber);
            });
        } else {
            if (row.myNumber !== myNumber) {
                db.run("UPDATE info SET myNumber = ?", [myNumber], (err) => {
                    if (err) {
                        throw err;
                    }
                    console.log("myNumber updated to:", myNumber);
                });
            } else {
                console.log("myNumber has not changed.");
            }
        }
    });

	db.close()
}