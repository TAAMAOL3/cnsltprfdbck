import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, login, loading } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [dbStatus, setDbStatus] = useState("Checking database connection..."); // Neuer Status für die DB-Verbindung
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const redirectPath = await login(email, password);

    if (redirectPath) {
      setError('');
      navigate(redirectPath);
    } else {
      setError('Login fehlgeschlagen. Bitte überprüfe deine Anmeldedaten.');
    }
  };

  useEffect(() => {
    if (user && !loading) {
      navigate('/user');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    fetch('/api/dbXstatus')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.message === 'Database connected successfully') {
          setDbStatus('Connected to the database');
        } else {
          setDbStatus('Database connection failed');
        }
      })
      .catch((error) => {
        setDbStatus('Error connecting to the database');
      });
  }, []);


  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title">Login</h1>
              {error && <div className="alert alert-danger">{error}</div>}
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
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Lade...' : 'Anmelden'}
                </button>
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
