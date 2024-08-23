import React, { useContext, useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { AuthContext } from './AuthContext'; 
import TeamFeedback from './TeamFeedback'; 
import TeamRequest from './TeamRequest'; 
import TeamReceived from './TeamReceived'; 
import TeamSelector from './TeamSelector'; 

const Team = () => {
  const { user } = useContext(AuthContext); // Aktueller Benutzer
  const navigate = useNavigate(); // Navigation für Weiterleitung
  const [selectedTeam, setSelectedTeam] = useState(user.teamId); // Ausgewähltes Team
  const [selectedUser, setSelectedUser] = useState('all'); // Ausgewählter Benutzer

  // Effekt zur Überprüfung, ob der Benutzer zugriffsberechtigt ist
  useEffect(() => {
    if (!user || user.role !== 2) { 
      navigate('/login'); // Weiterleitung zu Login, wenn Benutzer nicht Teamleiter ist
    }
  }, [user, navigate]);

    // Effekt, um Standardabfragen beim Laden der Seite auszuführen
    useEffect(() => {
      // Standardmäßige Team- und Benutzerfilter setzen
      if (user && user.teamId) {
        setSelectedTeam(user.teamId); // Setzt das Team des Benutzers standardmäßig
        setSelectedUser('all'); // Alle Benutzer standardmäßig
      }
    }, [user]);

  // Funktion, um Filteränderungen von TeamSelector zu handhaben
  const handleFilterChange = (teamId, userId) => {
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
            <h1>Teamleiter-Dashboard</h1> 
          </hgroup>
        </div>
      </section>

      <div className="container mt-5"> 
        {/* Auswahl von Team und Benutzer */}
        <TeamSelector onFilterChange={handleFilterChange} /> 
        
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
