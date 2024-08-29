const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
require('dotenv').config();
const fs = require('fs');

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: 'whatsappAuth'
  }),
  puppeteer: {
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  }
});

// Generate QR code for authentication
client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

// Log when the client is ready
client.on('ready', () => {
  console.log('Client is ready!');
});

// Respond to messages
client.on('message_create', async (msg) => {
  console.log(msg)
});

client.initialize();
