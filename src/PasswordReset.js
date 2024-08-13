// src/PasswordReset.js
import React, { useState } from 'react';
import './comstrap.min.css';

const PasswordReset = () => {
    const [email, setEmail] = useState('');

    const handleResetRequest = async (event) => {
        event.preventDefault();
        // Add logic to handle password reset request
        console.log("Requesting password reset for:", email);
    };

    return (
        <div className="password-reset-container">
            <h2>Passwort zurücksetzen.</h2>
            <p>Du erhältst ein Link per E-Mail, um dein Passwort zurückzusetzen.</p>
            <form onSubmit={handleResetRequest}>
                <div className="form-group">
                    <label>E-mail</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default PasswordReset;
