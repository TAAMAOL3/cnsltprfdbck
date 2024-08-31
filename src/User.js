import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import UserFeedback from './UserFeedback';
import UserRequest from './UserRequest';
import UserReceived from './UserReceived'; // Importiere die neue UserReceived-Komponente
import Profile from './Profile';

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
          <div className="feedback-legend">
            <div className="legend-item">
              <img className="evaluation-img" src="/Content/themes/base/images/VeryPositive.png" alt="Sehr Positiv" />
              <span>Sehr Positiv</span>
            </div>
            <div className="legend-item">
              <img className="evaluation-img" src="/Content/themes/base/images/Positive.png" alt="Positiv" />
              <span>Positiv</span>
            </div>
            <div className="legend-item">
              <img className="evaluation-img" src="/Content/themes/base/images/Unknown.png" alt="Neutral" />
              <span>Neutral</span>
            </div>
            <div className="legend-item">
              <img className="evaluation-img" src="/Content/themes/base/images/Negative.png" alt="Negativ" />
              <span>Negativ</span>
            </div>
            <div className="legend-item">
              <img className="evaluation-img" src="/Content/themes/base/images/VeryNegative.png" alt="Sehr Negativ" />
              <span>Sehr Negativ</span>
            </div>
          </div>
        </div>
      </section>
      <div className="container mt-5" id="flexcontainer">
        {/* Erhaltene Feedbacks-Tabelle */}
        <Profile />

        <UserReceived /> {/* Neue Tabelle hinzugefügt */}

        {/* Feedback-Tabelle */}
        <UserFeedback />

        {/* Feedback-Anfragen-Tabelle */}
        <UserRequest />


      </div>
      {/* <div className="sidebar">

        <h3>Zusätzlicher Inhalt</h3>

        <button className="btn btn-secondary">Beispiel-Button</button>
      </div> */}
    </div>

  );
};

export default User;
