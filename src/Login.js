import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Hinzufügen eines State für Fehlermeldungen
  const [success, setSuccess] = useState(''); // State für Erfolgsmeldungen

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // API-Aufruf zum Login
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess('Login erfolgreich!'); // Erfolgsmeldung setzen
        setError(''); // Fehler-Reset
        // Weitere Verarbeitung z.B. Token speichern, Redirect etc.
      } else {
        const errorData = await response.json();
        setError('Fehler: ' + (errorData.error || 'Login fehlgeschlagen')); // Fehlermeldung setzen
        setSuccess(''); // Erfolgsmeldung zurücksetzen
      }
    } catch (error) {
      setError('Fehler: Netzwerkproblem');
      setSuccess('');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Login</h5>
              {error && <div className="alert alert-danger">{error}</div>} {/* Fehlermeldung anzeigen */}
              {success && <div className="alert alert-success">{success}</div>} {/* Erfolgsmeldung anzeigen */}
              <form onSubmit={handleSubmit}>
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
                <button type="submit" className="btn btn-primary">Anmelden</button>
              </form>
              <div className="mt-3">
                <Link to="/register" className="btn btn-link">Neu registrieren</Link>
                <Link to="/password-reset" className="btn btn-link">Passwort vergessen?</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
