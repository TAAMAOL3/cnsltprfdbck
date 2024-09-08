import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { translate } from './translateFunction'; // Import the translate function

const Register = () => {
  const [vorname, setVorname] = useState('');
  const [nachname, setNachname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(''); 
  const [error, setError] = useState(false); 

  // State for translations
  const [translations, setTranslations] = useState({
    registerTitle: '',
    firstNameLabel: '',
    lastNameLabel: '',
    emailLabel: '',
    passwordLabel: '',
    confirmPasswordLabel: '',
    registerButton: '',
    alreadyRegisteredLink: '',
    passwordMismatchMessage: '',
    registrationSuccessMessage: '',
    registrationFailedMessage: '',
    tryAgainMessage: ''
  });

  // Load translations when the component mounts
  useEffect(() => {
    const loadTranslations = async () => {
      const registerTitle = await translate(160); // "Registrieren"
      const firstNameLabel = await translate(161); // "Vorname"
      const lastNameLabel = await translate(162); // "Nachname"
      const emailLabel = await translate(163); // "E-Mail Adresse"
      const passwordLabel = await translate(164); // "Passwort"
      const confirmPasswordLabel = await translate(165); // "Passwort bestätigen"
      const registerButton = await translate(166); // "Registrieren"
      const alreadyRegisteredLink = await translate(167); // "Bereits registriert? Anmelden"
      const passwordMismatchMessage = await translate(168); // "Passwörter stimmen nicht überein"
      const registrationSuccessMessage = await translate(169); // "Erfolgreich registriert"
      const registrationFailedMessage = await translate(170); // "Registrierung fehlgeschlagen"
      const tryAgainMessage = await translate(171); // "Ein Fehler ist aufgetreten. Bitte versuche es erneut."

      setTranslations({
        registerTitle,
        firstNameLabel,
        lastNameLabel,
        emailLabel,
        passwordLabel,
        confirmPasswordLabel,
        registerButton,
        alreadyRegisteredLink,
        passwordMismatchMessage,
        registrationSuccessMessage,
        registrationFailedMessage,
        tryAgainMessage
      });
    };

    loadTranslations();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (password !== confirmPassword) {
      setMessage(translations.passwordMismatchMessage);
      setError(true);
      return;
    }
  
    try {
      const response = await fetch('/api/register', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vorname, nachname, email, password }),
      });
  
      if (response.ok) {
        setMessage(translations.registrationSuccessMessage);
        setError(false);
      } else {
        const result = await response.json();
        setMessage(result.error || translations.registrationFailedMessage);
        setError(true);
      }
    } catch (error) {
      setMessage(translations.tryAgainMessage);
      setError(true);
    }
  };
  
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title">{translations.registerTitle}</h1>
              {message && (
                <div className={`alert ${error ? 'alert-danger' : 'alert-success'}`}>
                  {message}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="vorname">{translations.firstNameLabel}</label>
                  <input
                    type="text"
                    className="form-control"
                    id="vorname"
                    value={vorname}
                    onChange={(e) => setVorname(e.target.value)}
                    placeholder={translations.firstNameLabel}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="nachname">{translations.lastNameLabel}</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nachname"
                    value={nachname}
                    onChange={(e) => setNachname(e.target.value)}
                    placeholder={translations.lastNameLabel}
                    required
                  />
                </div>
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
                <div className="form-group">
                  <label htmlFor="confirmPassword">{translations.confirmPasswordLabel}</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={translations.confirmPasswordLabel}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">{translations.registerButton}</button>
              </form>
              <div className="mt-3">
                <Link to="/login">{translations.alreadyRegisteredLink}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
