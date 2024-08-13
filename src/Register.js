// src/Register.js
import React, { useState } from 'react';
import './comstrap.min.css';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async (event) => {
        event.preventDefault();
        // Implement registration logic here
        console.log("Registering:", { email, password, confirmPassword });
    };

    return (
        <div className="register-container">
            <h2>Account erstellen.</h2>
            <p>Achtung! Verwende bitte nicht dein Corproot-Passwort für die Registrierung.</p>
            <form onSubmit={handleRegister}>
                <div className="form-group">
                    <label>E-mail Adresse</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Passwort</label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Passwort bestätigen</label>
                    <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary">Account erstellen</button>
            </form>
        </div>
    );
};

export default Register;
