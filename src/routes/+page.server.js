import sqlite3 from 'sqlite3';

export async function load() {
    // Connect to the SQLite database
    const db = new sqlite3.Database('./messages.db');

    return new Promise((resolve, reject) => {
        // Step 1: Get 'mynumber' from the 'info' table
        db.get('SELECT myNumber FROM info', [], (err, row) => {
            if (err) {
                console.error(err);
                reject({ message: 'Error fetching my number' });
            } else {
                const mynumber = row.myNumber;

                // Step 2: Query messages and filter out 'mynumber'
                db.all('SELECT DISTINCT fromNumber, toNumber, fromMe, name, groupName FROM messages WHERE fromNumber IS NOT NULL', [], (err, rows) => {
                    if (err) {
                        console.error(err);
                        reject({ message: 'Error fetching contacts' });
                    } else {
                        // Create a Map to store unique numbers and their names
                        const uniqueContacts = new Map();

                        // Loop through the rows to populate the Map
                        rows.forEach(row => {
                            const { fromNumber, toNumber, fromMe, name, groupName } = row;

                            // Check and add unique contacts, excluding those where mynumber matches
                            if (fromNumber && fromMe == 0 && fromNumber !== mynumber) {
                                const number = fromNumber.endsWith('@g.us') ? fromNumber : fromNumber;
                                const contactName = fromNumber.endsWith('@g.us') ? groupName : name;
                                uniqueContacts.set(number, contactName);
                            }
                            if (toNumber && toNumber !== mynumber) {
                                const number = toNumber.endsWith('@g.us') ? toNumber : toNumber;
                                const contactName = toNumber.endsWith('@g.us') ? groupName : name;
                                uniqueContacts.set(number, contactName);
                            }
                        });

                        // Convert the Map to an Array of arrays
                        const contactsArray = Array.from(uniqueContacts.entries());
                        resolve({ contacts: contactsArray, pageName: 'WhatsApp Message Logger' });
                    }
                });
            }
        });
    });
}
