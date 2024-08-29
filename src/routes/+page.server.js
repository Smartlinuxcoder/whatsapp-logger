import sqlite3 from 'sqlite3';

    export async function load() {
        // Connect to the SQLite database
        const db = new sqlite3.Database('./messages.db');

        return new Promise((resolve, reject) => {
            db.all('SELECT DISTINCT fromNumber FROM messages', [], (err, rows) => {
                if (err) {
                    console.error(err);
                    reject({ message: 'Error fetching contacts' });
                } else {
                    resolve({ contacts: rows, pageName:'WhatsApp Message Logger'});
                }
            });
        });
    }