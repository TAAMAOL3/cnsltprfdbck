import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import UserFeedback from './UserFeedback.js';

const User = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Stelle sicher, dass nur angemeldete Benutzer Zugriff haben
  useEffect(() => {
    if (!user) {
      navigate('/login'); // Nicht angemeldete Benutzer weiterleiten
    }
  }, [user, navigate]);

  return (
    <div className="container-fluid mt-5">
      <section className="featured">
        <div className="content-wrapper banner">
          <div className="float-right">
            <img className="page-icon" src="/Content/themes/base/images/person_BOLD.svg" alt="User icon" />
          </div>
          <hgroup className="title">
            <h1>Benutzerbereich</h1>
          </hgroup>
        </div>
      </section>
      <div className="container mt-5">
        {/* Feedback-Tabelle */}
        <UserFeedback />

        {/* Zukünftige Tabellen oder Abschnitte für den Benutzerbereich */}
      </div>
    </div>
  );
};

export default User;
