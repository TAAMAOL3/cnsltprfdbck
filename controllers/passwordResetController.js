// controllers/passwordResetController.js
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const db = require('../config/db');

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
