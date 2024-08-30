import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [vorname, setVorname] = useState('');
  const [nachname, setNachname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(''); // Nachricht für Erfolg oder Fehler
  const [error, setError] = useState(false); // Status für Fehlermeldungen

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (password !== confirmPassword) {
      setMessage('Passwörter stimmen nicht überein');
      setError(true);
      return;
    }
  
    try {
      const response = await fetch('/api/register', {  // Pfad angepasst
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vorname, nachname, email, password }),
      });
  
      if (response.ok) {
        setMessage('Erfolgreich registriert');
        setError(false);
      } else {
        const result = await response.json();
        setMessage(result.error || 'Registrierung fehlgeschlagen');
        setError(true);
      }
    } catch (error) {
      setMessage('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
      setError(true);
    }
  };
  
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title">Registrieren</h1>
              {message && (
                <div className={`alert ${error ? 'alert-danger' : 'alert-success'}`}>
                  {message}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="vorname">Vorname</label>
                  <input
                    type="text"
                    className="form-control"
                    id="vorname"
                    value={vorname}
                    onChange={(e) => setVorname(e.target.value)}
                    placeholder="Vorname"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="nachname">Nachname</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nachname"
                    value={nachname}
                    onChange={(e) => setNachname(e.target.value)}
                    placeholder="Nachname"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">E-mail Adresse</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-mail Adresse"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Passwort</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Passwort"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Passwort bestätigen</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Passwort bestätigen"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Registrieren</button>
              </form>
              <div className="mt-3">
                <Link to="/login" className="btn btn-link">Bereits registriert? Anmelden</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
