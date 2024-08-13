// Register.js
import React, { useState } from 'react';
import './comstrap.min.css'; // Import local CSS

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('User');
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, role }),
        });

        const data = await response.json();

        if (response.ok) {
            setMessage('Registration successful!');
            setMessageType('success');
        } else {
            setMessage(data.error || 'Registration failed.');
            setMessageType('error');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="form-horizontal">
                <h2 className="h2">Register</h2>
                <label className="control-label">
                    Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-control" />
                </label>
                <label className="control-label">
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="form-control" />
                </label>
                <label className="control-label">
                    Role:
                    <select value={role} onChange={(e) => setRole(e.target.value)} className="form-control">
                        <option value="User">User</option>
                        <option value="Leader">Leader</option>
                        <option value="Admin">Admin</option>
                    </select>
                </label>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
            {message && (
                <div className={`message ${messageType === 'success' ? 'text-success' : 'text-danger'}`}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default Register;
