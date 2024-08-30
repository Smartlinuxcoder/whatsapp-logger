const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./messages.db');


db.serialize(() => {
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
            groupName TEXT,
            forwarded BOOL
        )
    `);
    
    db.run(`
        CREATE TABLE IF NOT EXISTS message_edits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            messageText TEXT,
            timestamp TEXT,
            messageId TEXT
        )
    `);
    
    db.run(`
        CREATE TABLE IF NOT EXISTS info (
            myNumber TEXT PRIMARY KEY
        )
    `);
});

module.exports = db