import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importiere die Link-Komponente


const PasswordReset = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Hier könnte ein API-Aufruf zum Zurücksetzen des Passworts hinzugefügt werden
    console.log('Email:', email);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title">Passwort zurücksetzen</h1>
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
                <button type="submit" className="btn btn-primary">Passwort zurücksetzen</button>
              </form>
              <div className="mt-3">
                <Link to="/login" className="btn btn-link">Zurück zur Anmeldung</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
