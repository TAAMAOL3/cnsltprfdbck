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
            <h1>Meine Feedbacks</h1>
            <p>Überblick über erhaltene, offene und selbst erstellte Feedbacks</p>
          </hgroup>
        </div>
      </section>
      <div className="container mt-5" id="flexcontainer">
        {/* Erhaltene Feedbacks-Tabelle */}
        <UserReceived /> {/* Neue Tabelle hinzugefügt */}

        {/* Feedback-Tabelle */}
        <UserFeedback />

        {/* Feedback-Anfragen-Tabelle */}
        <UserRequest />


      </div>
      <div className="sidebar">
        {/* Hier kommt der Inhalt der neuen Subseite oder des zusätzlichen Inhalts hin */}
        <h3>Zusätzlicher Inhalt</h3>
        <p>Hier könnte z.B. eine weitere Navigation, Statistiken oder ein Dashboard sein.</p>
        <button className="btn btn-secondary">Beispiel-Button</button>
      </div>
    </div>

  );
};

export default User;
