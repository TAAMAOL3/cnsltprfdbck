import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Ladezustand für Benutzerdaten

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setLoading(true); // Explicitly setting loading to true while fetching user
            fetch('/api/user', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((response) => response.json())
                .then((data) => {
                    setUser(data.user); // Benutzerdaten speichern
                    setLoading(false); // Ladezustand beenden
                })
                .catch(() => {
                    setUser(null);
                    setLoading(false); // Ladezustand beenden
                });
        } else {
            setLoading(false); // Kein Token, Ladezustand auf false setzen
        }
    }, []);

    const login = async (email, password) => {
        setLoading(true); // Explicitly set loading before attempting login
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            setUser(data.user); // Set user immediately after login
            localStorage.setItem('token', data.token); // Token im LocalStorage speichern
            setLoading(false); // Ladezustand beenden
            return '/dashboard'; // Weiterleitungspfad nach Login
        }

        setLoading(false); // Set loading to false on failed login
        return null; // Rückgabe null, wenn der Login fehlschlägt
    };

    const logout = async () => {
        setLoading(true); // Set loading while logging out
        await fetch('/api/logout', { method: 'POST' });
        setUser(null);
        localStorage.removeItem('token');
        setLoading(false); // Ladezustand beenden
        return '/login'; // Weiterleitung zur Login-Seite
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };
