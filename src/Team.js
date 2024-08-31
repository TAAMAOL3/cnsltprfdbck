import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import TeamFeedback from './TeamFeedback';
import TeamRequest from './TeamRequest';
import TeamReceived from './TeamReceived';
import TeamSelector from './TeamSelector';
import Profile from './Profile'; // Import der Profile-Komponente
import TeamProfile from './TeamProfile'; // Import der TeamProfile-Komponente

const Team = () => {
  const { user } = useContext(AuthContext); // Aktueller Benutzer
  const navigate = useNavigate(); // Navigation für Weiterleitung
  const [selectedTeam, setSelectedTeam] = useState(user.role === 3 ? 'all' : user.teamId); // Ausgewähltes Team, standardmäßig 'all' bei Rolle 3
  const [selectedUser, setSelectedUser] = useState('all'); // Ausgewählter Benutzer

  // Effekt zur Überprüfung, ob der Benutzer zugriffsberechtigt ist
  useEffect(() => {
    if (!user || ![2, 3].includes(user.role)) {
      navigate('/login'); // Weiterleitung zu Login, wenn Benutzer weder Rolle 2 noch Rolle 3 hat
    }
  }, [user, navigate]);

  // Effekt, um Standardabfragen beim Laden der Seite auszuführen
  useEffect(() => {
    // Standardmäßige Team- und Benutzerfilter setzen
    if (user) {
      if (user.role === 3) {
        setSelectedTeam('all'); // Setzt das Team auf 'all', wenn die Benutzerrolle 3 ist
      } else if (user.teamId) {
        setSelectedTeam(user.teamId); // Setzt das Team des Benutzers standardmäßig, wenn die Rolle nicht 3 ist
      }
      setSelectedUser('all'); // Alle Benutzer standardmäßig
    }
  }, [user]);

  // Funktion, um Filteränderungen von TeamSelector zu handhaben
  const handleFilterChange = (teamId, userId) => {
    console.log("Filteränderung:", teamId, userId); // Debugging-Log
    setSelectedTeam(teamId); // Team setzen
    setSelectedUser(userId); // Benutzer setzen
  };

  return (
    <div className="container-fluid mt-5">
      <section className="featured">
        <div className="content-wrapper banner">
          <div className="float-right">
            <img className="page-icon" src="/Content/themes/base/images/Chain.png" alt="Team icon" />
          </div>
          <hgroup className="title">
            <h1>Team Feedbacks</h1>
            <p>Überblick über erhaltene, offene und selbst erstellte Feedbacks des gesamten Teams</p>
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

      <div className="container mt-5">
        {/* Auswahl von Team und Benutzer */}
        <TeamSelector onFilterChange={handleFilterChange} />

        {/* TeamProfile anzeigen, wenn kein Benutzer und ein spezifisches Team ausgewählt wurde */}
        {selectedUser === 'all' && selectedTeam !== 'all' && <TeamProfile selectedTeamId={selectedTeam} />}

        {/* Profile Komponente anzeigen, wenn ein spezifischer Benutzer ausgewählt ist */}
        {selectedUser !== 'all' && <Profile selectedUserId={selectedUser} />}

        {/* Tabelle für erhaltene Team-Feedbacks */}
        <TeamReceived selectedTeam={selectedTeam} selectedUser={selectedUser} />

        {/* Tabelle für Team-Feedback, das das Team erstellt hat */}
        <TeamFeedback selectedTeam={selectedTeam} selectedUser={selectedUser} />

        {/* Tabelle für Feedback-Anfragen */}
        <TeamRequest selectedTeam={selectedTeam} selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default Team;
