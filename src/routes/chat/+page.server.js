import sqlite3 from 'sqlite3';

export async function load({ url }) {
    const contact = url.searchParams.get('contact'); // Get the contact from query parameters
    const db = new sqlite3.Database('./messages.db');

    return new Promise((resolve, reject) => {
        // Fetch messages based on the contact
        db.all('SELECT * FROM messages WHERE fromNumber = ? OR toNumber = ?', [contact, contact], (err, messageRows) => {
            if (err) {
                console.error(err);
                return reject({ message: 'Error fetching messages' });
            }

            // Fetch all rows from the message_edits table
            db.all('SELECT * FROM message_edits', [], (err, editRows) => {
                if (err) {
                    console.error(err);
                    return reject({ message: 'Error fetching message edits' });
                }

                // Resolve with both messages and edits
                resolve({
                    messages: messageRows,
                    edits: editRows,
                    pageName: 'Chat with ' + contact
                });
            });
        });
    });
}
