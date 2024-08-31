require('dotenv').config();
const nodemailer = require('nodemailer');

// Transporter Konfiguration mit Werten aus der .env Datei
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true', // true für port 465, false für andere Ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    },
    logger: true, // Aktiviert Logging für den Transporter
    debug: true // Aktiviert Debugging für den Transporter
});

// Funktion zum Senden einer E-Mail
async function sendMail(to, subject, body) {
    const mailOptions = {
        from: `"NoReply-SmartFeedback" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: subject,
        text: body
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('E-Mail gesendet: %s', info.messageId);
    } catch (error) {
        console.error('Fehler beim E-Mail-Versand:', error);
    }
}

module.exports = { sendMail };
