import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { translate } from './translateFunction'; // Import the translate function

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  
  // State for translations
  const [translations, setTranslations] = useState({
    resetPasswordTitle: '',
    emailLabel: '',
    emailPlaceholder: '',
    resetPasswordButton: '',
    backToLoginLink: ''
  });

  // Load translations when the component mounts
  useEffect(() => {
    const loadTranslations = async () => {
      const resetPasswordTitle = await translate(150); // "Passwort zurücksetzen"
      const emailLabel = await translate(151); // "E-Mail Adresse"
      const emailPlaceholder = await translate(152); // "E-Mail Adresse"
      const resetPasswordButton = await translate(153); // "Passwort zurücksetzen"
      const backToLoginLink = await translate(154); // "Zurück zur Anmeldung"

      setTranslations({
        resetPasswordTitle,
        emailLabel,
        emailPlaceholder,
        resetPasswordButton,
        backToLoginLink
      });
    };

    loadTranslations();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    
    fetch('/api/password-reset/send-password-reset-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Fehler:', error));
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title">{translations.resetPasswordTitle}</h1>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">{translations.emailLabel}</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={translations.emailPlaceholder}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">{translations.resetPasswordButton}</button>
              </form>
              <div className="mt-3">
                <Link to="/login">{translations.backToLoginLink}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
