import sqlite3 from 'sqlite3';

export async function load() {
    // Connect to the SQLite database
    const db = new sqlite3.Database('./messages.db');

    return new Promise((resolve, reject) => {
        db.all('SELECT DISTINCT fromNumber, toNumber FROM messages WHERE fromNumber IS NOT NULL', [], (err, rows) => {
            if (err) {
                console.error(err);
                reject({ message: 'Error fetching contacts' });
            } else {
                // Create a Set to store unique numbers
                const uniqueNumbers = new Set();

                // Loop through the rows and add each number to the Set
                rows.forEach(row => {
                    if (row.fromNumber && row.fromMe == false) uniqueNumbers.add(row.fromNumber);
                    if (row.toNumber) uniqueNumbers.add(row.toNumber);
                });

                // Convert the Set to an Array
                const uniqueNumbersArray = Array.from(uniqueNumbers);

                console.log(uniqueNumbersArray);
                resolve({ contacts: uniqueNumbersArray, pageName: 'WhatsApp Message Logger' });
            }
        });
    });
}
