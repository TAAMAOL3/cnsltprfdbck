import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importiere die Link-Komponente


const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Hier könnte ein API-Aufruf zur Registrierung hinzugefügt werden
    if (password !== confirmPassword) {
      console.log('Passwörter stimmen nicht überein');
      return;
    }
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Registrieren</h5>
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
