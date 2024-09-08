import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { translate } from './translateFunction'; // Übersetzungsfunktion importieren

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, login, loading } = useContext(AuthContext);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Zustände für die Übersetzungen
  const [translations, setTranslations] = useState({
    loginTitle: '',
    emailLabel: '',
    passwordLabel: '',
    loginFailed: '',
    loadingText: '',
    forgotPassword: '',
    register: '',
  });

  // useEffect, um die Übersetzungen beim Laden der Komponente zu holen
  useEffect(() => {
    const loadTranslations = async () => {
      const loginTitle = await translate(2); // "Log in."
      const emailLabel = await translate(3); // "E-Mail"
      const passwordLabel = await translate(4); // "Passwort"
      const loginFailed = await translate(1); // "Login fehlgeschlagen. Bitte überprüfe deine Anmeldedaten."
      const loadingText = await translate(5); // "Lade..."
      const forgotPassword = await translate(6); // "Passwort vergessen?"
      const register = await translate(7); // "Neu registrieren"

      setTranslations({
        loginTitle,
        emailLabel,
        passwordLabel,
        loginFailed,
        loadingText,
        forgotPassword,
        register,
      });
    };

    loadTranslations();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const redirectPath = await login(email, password, rememberMe);

    if (redirectPath) {
      if (redirectPath === '/change-password') {
        navigate('/change-password');
      } else {
        setError('');
        navigate(redirectPath);
      }
    } else {
      setError(translations.loginFailed); // Fehlermeldung bei falschen Anmeldedaten
    }
  };

  useEffect(() => {
    if (user && !loading) {
      navigate('/user');
    }
  }, [user, loading, navigate]);

  return (
    <div className="container mt-5" id="flexcontainer-fluid">
      <div className="row justify-content-center" id="flexcontainer">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title">{translations.loginTitle}</h1>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">{translations.emailLabel}</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={translations.emailLabel}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">{translations.passwordLabel}</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={translations.passwordLabel}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                  {loading ? translations.loadingText : translations.loginTitle}
                </button>
              </form>
              <div className="mt-3 form-links">
                <Link to="/password-reset">{translations.forgotPassword}</Link>
                <Link to="/register">{translations.register}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;