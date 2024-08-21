import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import UserFeedback from './UserFeedback';
import UserRequest from './UserRequest';
import UserReceived from './UserReceived'; // Importiere die neue UserReceived-Komponente

const User = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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
        {/* Erhaltene Feedbacks-Tabelle */}
        <UserReceived /> {/* Neue Tabelle hinzugefügt */}

        {/* Feedback-Tabelle */}
        <UserFeedback />

        {/* Feedback-Anfragen-Tabelle */}
        <UserRequest />


      </div>
    </div>
  );
};

export default User;
