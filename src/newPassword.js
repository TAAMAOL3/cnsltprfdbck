import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext'; // Importiere den AuthContext

const NewPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // Erfolgsmeldung
  const [userId, setUserId] = useState(null); // Speichern der userId
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext); // Zugriff auf die logout-Funktion

  // Funktion, um die UserID aus dem Token zu extrahieren
  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId;
  };

  // Holen der userId aus dem Token beim Mount
  useState(() => {
    const id = getUserIdFromToken();
    if (id) {
      setUserId(id);
    } else {
      setError('Benutzer nicht authentifiziert.');
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/change-password', { userId, password }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Nach dem erfolgreichen Passwort-Update
      setSuccess(true);

      // 3 Sekunden warten, dann logout ausführen und weiterleiten
      setTimeout(async () => {
        await logout(); // Abmeldung durchführen
        navigate('/login'); // Weiterleitung nach /login
      }, 3000);
    } catch (error) {
      setError('Fehler beim Ändern des Passworts. Bitte versuche es erneut.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title">Neues Passwort setzen</h1>
              {error && <div className="alert alert-danger">{error}</div>}
              {success ? (
                <div className="feedback-success-message" style={{ textAlign: 'center' }}>
                  <div className="checkmark">&#10003;</div>
                  <h3>Passwort erfolgreich geändert.<br />Du wirst in Kürze weitergeleitet.</h3>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="password">Neues Passwort</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Neues Passwort"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Passwort wiederholen</label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Passwort wiederholen"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block" disabled={!userId}>
                    Passwort ändern
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;