import sqlite3 from 'sqlite3';

    export async function load({ url }) {
        const contact = url.searchParams.get('contact'); // Get the contact from query parameters
        const db = new sqlite3.Database('./messages.db');
        
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM messages WHERE fromNumber = ? OR toNumber = ?', [contact, contact], (err, rows) => {
                if (err) {
                    console.error(err);
                    reject({ message: 'Error fetching messages' });
                } else {
                    resolve({messages: rows, pageName: contact});
                }
            });
        });
    }