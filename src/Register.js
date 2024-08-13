import React, { useState } from 'react';
import './comstrap.min.css'; // CSS-Datei korrekt einbinden

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (event) => {
        event.preventDefault();
        
        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, confirmPassword }),
            });
            
            const data = await response.json();
            if (response.ok) {
                // Erfolg: Benutzer wurde registriert
                setMessage('Registrierung erfolgreich!');
            } else {
                // Fehler: Zeige die Fehlermeldung an
                setMessage(data.error || 'Ein Fehler ist aufgetreten.');
            }
        } catch (error) {
            setMessage('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
        }
    };

    return (
        <div>
            <h2>Account erstellen</h2>
            <form onSubmit={handleRegister}>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="E-mail Adresse" 
                    required 
                />
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Passwort" 
                    required 
                />
                <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    placeholder="Passwort bestätigen" 
                    required 
                />
                <button type="submit">Account erstellen</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;
