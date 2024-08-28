const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const db = require('../config/db');

exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { vorname, nachname, email, password } = req.body;

    // Check if email already exists
    db.query("SELECT * FROM t_users WHERE usersEmail = ?", [email], async (err, results) => {
        if (err) {
            console.error("Database query error:", err);  // Fehlerprotokollierung
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query("SELECT rolesID FROM t_roles WHERE rolesName = 'user'", (err, results) => {
            if (err || results.length === 0) {
                console.error("Role not found or error in query:", err);  // Fehlerprotokollierung
                return res.status(500).json({ error: "Role not found" });
            }

            const roleId = results[0].rolesID;
            console.log("Role found:", roleId);
            console.log("Inserting user with email:", email);

            db.query(
                "INSERT INTO t_users (usersVorname, usersNachname, usersEmail, password, rolesFK) VALUES (?, ?, ?, ?, ?)",
                [vorname, nachname, email, hashedPassword, roleId],
                (error) => {
                    if (error) {
                        console.error("Error registering user:", error);  // Fehlerprotokollierung
                        return res.status(500).json({ error: "Error registering user" });
                    }
                    res.status(201).json({ message: "User registered successfully" });
                }
            );
        });
    });
};
