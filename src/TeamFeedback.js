import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const TeamFeedback = ({ selectedTeam, selectedUser }) => {
  const { user } = useContext(AuthContext); // eslint-disable-line no-use-before-define
  const [feedbacks, setFeedbacks] = useState([]); // Liste der erstellten Feedbacks
  const [viewingFeedback, setViewingFeedback] = useState(null); // Detailansicht eines Feedbacks
  const [activeRow, setActiveRow] = useState(null); // Neuer Zustand für die aktive Zeile

  // Formatierung des Datums für die Anzeige im Format dd/MM/yyyy
  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Effekt zum Laden der erstellten Feedback-Daten für das Team
  useEffect(() => {
    const fetchTeamFeedback = async () => {
      const token = localStorage.getItem('token'); // Token für API-Anfragen

      const teamId = selectedTeam === 'all' ? 'all' : selectedTeam;

      if (selectedTeam) {
        try {
          const url = selectedUser && selectedUser !== 'all'
            ? `/api/team/feedback/${teamId}/${selectedUser}`
            : `/api/team/feedback/${teamId}`;

          const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` } // Autorisierung
          });

          // Überprüfe, ob die Antwort ein Array ist, wenn nicht, setze es auf ein leeres Array
          setFeedbacks(Array.isArray(response.data) ? response.data : []); // Feedbacks setzen
        } catch (error) {
          console.error('Fehler beim Abrufen des Team-Feedbacks:', error);
          setFeedbacks([]); // Bei Fehler leere Liste setzen
        }
      }
    };

    fetchTeamFeedback(); // Feedback-Daten laden, wenn sich Team oder Benutzer ändern
  }, [selectedTeam, selectedUser]);

  const handleViewFeedback = (feedback) => {// eslint-disable-line no-use-before-define
    setViewingFeedback(feedback); // Detailansicht des Feedbacks setzen
    setActiveRow(feedback.variousFdbckID); // Setzt die aktive Zeile
  };

  return (
    <div className="mb-5">
      <h3>Team Feedback</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Feedback Erhalten</th>
            <th>Empfänger</th>
            <th>Kunde</th>
            <th>Beschreibung</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.length > 0 ? (
            feedbacks.map((feedback, index) => {
              const previousFeedback = feedbacks[index - 1];
              const currentYear = new Date(feedback.variousFdbckReceived).getFullYear();
              const previousYear = previousFeedback ? new Date(previousFeedback.variousFdbckReceived).getFullYear() : currentYear;

              const isNewYear = previousFeedback && currentYear < previousYear;

              return (
                <React.Fragment key={feedback.variousFdbckID}>
                  {isNewYear && <tr className="year-separator"></tr>}
                  <tr
                    className={activeRow === feedback.variousFdbckID ? 'active' : ''}
                  >
                    <td>{formatDateForDisplay(feedback.variousFdbckReceived)}</td>
                    <td>{feedback.usersName}</td>
                    <td>{feedback.variousFdbckCustomer}</td>
                    <td>{feedback.variousFdbckDescription}</td>
                    <td>
                      {feedback.uploadUrl ? (
                        <button className="btn btn-primary" onClick={() => {
                          const link = document.createElement('a');
                          link.href = feedback.uploadUrl;
                          link.setAttribute('download', '');
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}>
                          Datei herunterladen
                        </button>
                      ) : (
                        'Keine Datei'
                      )}
                    </td>
                  </tr>
                </React.Fragment>
              );
            })
          ) : (
            <tr>
              <td colSpan="6">Keine Feedbacks gefunden.</td>
            </tr>
          )}
        </tbody>
      </table>

      {viewingFeedback && (
        <div className="mt-5">
          <h3>Feedback anzeigen</h3>
          <p style={{ fontSize: '1.5rem' }}><strong>Feedback:</strong> {viewingFeedback.customerFdbckText}</p>
          <button className="btn btn-secondary" onClick={() => setViewingFeedback(null)}>Schließen</button>
        </div>
      )}
    </div>
  );
};

export default TeamFeedback;
