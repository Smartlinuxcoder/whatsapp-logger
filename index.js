const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
require('dotenv').config();
const fs = require('fs');
var axios = require("axios").default;


let token = null;

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: 'whatsappAuth'
  }),
  /* puppeteer: {
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  } */
});

// Generate QR code for authentication
client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

// Log when the client is ready
client.on('ready', () => {
  console.log('Client is ready!');

  var options = {
    method: 'POST',
    url: 'https://auth.smartlinux.xyz/api/user/login',
    headers: {
      'Content-Type': 'application/json',
      'ContentsDiary-Type': 'application/json',
    },
    data: { username: process.env.USER_NAME, password: process.env.USER_PASSWORD, site: process.env.SITE_NAME }
  };

  axios.request(options).then(function (response) {
    token = response.data.hash;
  }).catch(function (error) {
    console.error(error);
  });
});

// Respond to messages
client.on('message_create', async (msg) => {
  var options = {
    method: 'POST',
    url: 'https://auth.smartlinux.xyz/api/db/updateJson',
    headers: {'Content-Type': 'application/json'},
    data: {
      sessiontoken: token,
      data: msg,
      website: 'process.env.SITE_NAME'
    }
  };
  
  axios.request(options).then(function (response) {
    console.log(response.data);
  }).catch(function (error) {
    console.error(error);
  });
  console.log(msg);
});

client.initialize();
