const qrcode = require("qrcode-terminal");

module.exports = async (client, qr) => {
	qrcode.generate(qr, { small: true });
}