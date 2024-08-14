import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // const navigate = useNavigate();

    const login = async (email, password) => {
        // API-Aufruf zur Authentifizierung
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            localStorage.setItem('token', data.token);
            <Link to="/dashboard">Dashboard</Link>
        }

        return response;
    };

    const register = async (email, password) => {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            localStorage.setItem('token', data.token);
            <Link to="/dashboard">Dashboard</Link>
        }

        return response;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        <Link to="/login">Login</Link>
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
