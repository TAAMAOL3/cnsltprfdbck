const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const db = require('../config/db'); // Angenommen, die DB-Verbindung wird hier verwaltet

exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query("SELECT id FROM roles WHERE name = ?", [role], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(500).json({ error: "Role not found" });
        }

        const roleId = results[0].id;
        db.query(
            "INSERT INTO users (email, password, role_id) VALUES (?, ?, ?)",
            [email, hashedPassword, roleId],
            (error) => {
                if (error) {
                    return res.status(500).json({ error: "Error registering user" });
                }
                res.status(201).json({ message: "User registered successfully" });
            }
        );
    });
};
