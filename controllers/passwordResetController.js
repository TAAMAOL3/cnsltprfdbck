const crypto = require('crypto');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const { sendMail } = require('../src/mailService');

exports.requestPasswordReset = (req, res) => {
    const { email } = req.body;
    const token = crypto.randomBytes(20).toString('hex');

    // Store token and set expiration date
    const expirationDate = new Date(Date.now() + 3600000); // 1 hour

    db.query(
        "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
        [token, expirationDate, email],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Database error" });
            }
            if (result.affectedRows === 0) {
                return res.status(400).json({ error: "Email not found" });
            }
            // TODO: Send email with token here
            res.json({ message: "Password reset token sent" });
        }
    );
};

exports.resetPassword = (req, res) => {
    const { email, token, newPassword } = req.body;

    db.query(
        "SELECT * FROM users WHERE email = ? AND reset_token = ? AND reset_token_expiry > NOW()",
        [email, token],
        async (err, results) => {
            if (err || results.length === 0) {
                return res.status(400).json({ error: "Invalid token or expired" });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            db.query(
                "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?",
                [hashedPassword, email],
                (error) => {
                    if (error) {
                        return res.status(500).json({ error: "Error updating password" });
                    }
                    res.json({ message: "Password updated successfully" });
                }
            );
        }
    );
};

exports.sendPasswordResetEmail = (req, res) => {
    const { email } = req.body;

    // Versendet die E-Mail zur Passwort-Zurücksetzung
    sendMail(email, 'Passwort-Zurücksetzung', 'Dies ist eine generische E-Mail zur Bestätigung Ihrer Passwort-Zurücksetzungsanforderung.')
        .then(() => res.status(200).json({ message: 'E-Mail gesendet' }))
        .catch(error => res.status(500).json({ error: 'Fehler beim E-Mail-Versand', details: error.message }));
};

// Neue Funktion zum Ändern des Passworts
exports.changePassword = async (req, res) => {
    const { userId, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Passwort ändern und hastochange auf 0 setzen
        db.query(
            "UPDATE t_users SET password = ?, hastochange = 0 WHERE usersID = ?",
            [hashedPassword, userId],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ error: "Fehler beim Aktualisieren des Passworts" });
                }
                if (result.affectedRows === 0) {
                    return res.status(400).json({ error: "Benutzer nicht gefunden" });
                }

                res.json({ message: "Passwort erfolgreich geändert, 'hastochange' zurückgesetzt" });
            }
        );
    } catch (error) {
        res.status(500).json({ error: "Fehler beim Hashen des Passworts" });
    }
};
