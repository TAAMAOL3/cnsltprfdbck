// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './comstrap.min.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [stayLoggedIn, setStayLoggedIn] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        // Implement login logic here
        console.log("Login attempt with:", { email, password, stayLoggedIn });
        // Simulate navigation:
        navigate('/dashboard');
    };

    return (
        <div className="login-container">
            <h2>Log in.</h2>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>E-Mail</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Passwort</label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="checkbox">
                    <label>
                        <input type="checkbox" checked={stayLoggedIn} onChange={(e) => setStayLoggedIn(e.target.checked)} />
                        angemeldet bleiben?
                    </label>
                </div>
                <button type="submit" className="btn btn-primary">Log in</button>
                <div className="links">
                    <a onClick={() => navigate('/password-reset')}>Passwort vergessen</a>
                    <a onClick={() => navigate('/register')}>Neu registrieren</a>
                </div>
            </form>
        </div>
    );
};

export default Login;
