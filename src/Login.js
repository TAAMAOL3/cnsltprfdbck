import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './comstrap.min.css'; // Lokales CSS für Corporate Design

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [stayLoggedIn, setStayLoggedIn] = useState(false);
    const { login } = useContext(AuthContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const { token } = await response.json();
            login(token);
            alert('Login successful!');
        } else {
            alert('Login failed.');
        }
    };

    return (
        <div className="login-container" style={{ fontFamily: 'TheSans, Arial, sans-serif' }}>
            <h2 className="h2">Log in.</h2>
            <form onSubmit={handleSubmit} className="form-horizontal">
                <div className="form-group">
                    <label htmlFor="email" className="control-label">E-Mail</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="control-label">Passwort</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <div className="checkbox">
                    <input
                        type="checkbox"
                        id="stay-logged-in"
                        checked={stayLoggedIn}
                        onChange={e => setStayLoggedIn(e.target.checked)}
                        className="form-check-input"
                    />
                    <label htmlFor="stay-logged-in" className="form-check-label">angemeldet bleiben?</label>
                </div>
                <button type="submit" className="btn btn-primary">Log in</button>
                <div className="links">
                    <a href="#forgot-password" className="text-primary">Passwort vergessen</a>
                    <Link to="/register" className="text-primary">Neu registrieren</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
