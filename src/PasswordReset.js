// PasswordReset.js
import React, { useState } from 'react';

const PasswordReset = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleRequestToken = async () => {
        const response = await fetch('/request-password-reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        if (response.ok) {
            setMessage('Reset token sent to your email');
        } else {
            setMessage(data.error);
        }
    };

    const handleResetPassword = async () => {
        const response = await fetch('/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, token, newPassword }),
        });

        const data = await response.json();
        if (response.ok) {
            setMessage('Password updated successfully');
        } else {
            setMessage(data.error);
        }
    };

    return (
        <div>
            <h2>Password Reset</h2>
            <div>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                />
                <button onClick={handleRequestToken}>Request Token</button>
            </div>
            <div>
                <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter your token"
                />
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                />
                <button onClick={handleResetPassword}>Reset Password</button>
            </div>
            {message && <div className="message">{message}</div>}
        </div>
    );
};

export default PasswordReset;
