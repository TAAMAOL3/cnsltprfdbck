// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './comstrap.min.css'; // Ensure this CSS contains all the classes you need

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [stayLoggedIn, setStayLoggedIn] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        // Implement login logic here
        console.log("Login attempt with:", { email, password, stayLoggedIn });
        // Simulate successful navigation:
        navigate('/dashboard'); // Adjust according to your routing
    };

    return (
        <div className="content-wrapper main-content clear-fix">
            <h2>Log in.</h2>
            <form onSubmit={handleLogin} noValidate>
                <div className="form-group">
                    <label htmlFor="email">E-Mail</label>
                    <input type="email" id="email" name="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Passwort</label>
                    <input type="password" id="password" name="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="form-group">
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" name="remember" checked={stayLoggedIn} onChange={(e) => setStayLoggedIn(e.target.checked)} />
                            angemeldet bleiben?
                        </label>
                    </div>
                </div>
                <button type="submit" className="btn btn-default">Log in</button>
                <div className="links">
                    <a href="#" onClick={() => navigate('/password-reset')}>Passwort vergessen</a>
                    <a href="#" onClick={() => navigate('/register')}>Neu registrieren</a>
                </div>
            </form>
        </div>
    );
};

export default Login;
